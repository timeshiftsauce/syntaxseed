const knex = require('knex')
const Redis = require("ioredis")

// 使用新的配置管理系统
const ConfigManager = require('./config/ConfigManager')

// 加载配置
let config
try {
  config = ConfigManager.loadConfig()

  // 验证配置
  const validationErrors = ConfigManager.validate()
  if (validationErrors.length > 0) {
    console.error('❌ 配置验证失败:')
    validationErrors.forEach(error => console.error(`  • ${error}`))
    process.exit(1)
  }

  console.log('✅ 配置加载和验证成功')
} catch (error) {
  console.error('❌ 配置加载失败:', error.message)

  // 提供配置错误的详细信息
  if (error.field) {
    console.error(`   配置字段: ${error.field}`)
    console.error(`   当前值: ${error.value}`)
  }

  // 提供修复建议
  if (error.message.includes('DB_')) {
    console.error('💡 修复建议: 请检查数据库相关的环境变量配置')
    console.error('   支持的环境变量: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME')
    console.error('   连接池配置: DB_POOL_MIN, DB_POOL_MAX, DB_POOL_ACQUIRE_TIMEOUT, DB_POOL_IDLE_TIMEOUT')
  }

  if (error.message.includes('REDIS_')) {
    console.error('💡 修复建议: 请检查 Redis 相关的环境变量配置')
    console.error('   支持的环境变量: REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB, REDIS_PREFIX')
  }

  process.exit(1)
}

// 获取数据库和 Redis 配置
const dbConfig = ConfigManager.getDatabaseConfig()
const redisConfig = ConfigManager.getRedisConfig()

// 使用配置管理器中的连接池配置，并添加额外的连接池参数
const poolConfig = {
  ...dbConfig.pool,
  createTimeoutMillis: 30000, // 创建连接超时时间
  reapIntervalMillis: 1000, // 清理间隔时间
  createRetryIntervalMillis: 200, // 重试间隔时间
  propagateCreateError: false, // 不传播创建错误
}

// 慢查询日志记录
const logSlowQueries = (query, ms) => {
  if (ms >= 1000) {
    // 记录执行时间超过1秒的查询
    console.warn(
      `[${new Date().toISOString()}] 慢查询 (${ms}ms): ${query.sql}`,
    )
    if (query.bindings && query.bindings.length) {
      console.warn(`参数: ${JSON.stringify(query.bindings)}`)
    }
  }
}

// 合并配置
const knexConfig = {
  client: dbConfig.client,
  connection: dbConfig.connection,
  pool: poolConfig,
  acquireConnectionTimeout: 60000, // 获取连接的超时时间
  debug: config.app.env === 'development', // 开发环境启用调试
  asyncStackTraces: config.app.env === 'development', // 开发环境启用异步堆栈跟踪
  log: {
    warn: (message) => console.warn(`[DB] ${message}`),
    error: (message) => console.error(`[DB] ${message}`),
    deprecate: (message) => console.warn(`[DB] 弃用警告: ${message}`),
    debug: (message) =>
      config.app.env === 'development' && console.log(`[DB] ${message}`),
  },
}

// 创建数据库连接实例
let db
try {
  db = knex(knexConfig)
  console.log('✅ 数据库连接池初始化成功')

  // 输出连接配置信息（隐藏敏感信息）
  console.log(`   数据库: ${dbConfig.connection.database}@${dbConfig.connection.host}:${dbConfig.connection.port}`)
  console.log(`   连接池: ${poolConfig.min}-${poolConfig.max} 连接`)

  // 添加查询事件监听器，用于记录慢查询
  db.on('query', (query) => {
    query.startTime = Date.now()
  })

  db.on('query-response', (_response, query) => {
    const duration = Date.now() - query.startTime
    logSlowQueries(query, duration)
  })

  db.on('query-error', (error, query) => {
    const duration = Date.now() - query.startTime
    console.error(
      `[${new Date().toISOString()}] [DB] 查询错误 (${duration}ms): ${query.sql}`,
    )
    console.error(`[DB] 错误: ${error.message}`)
    if (query.bindings && query.bindings.length) {
      console.error(`[DB] 参数: ${JSON.stringify(query.bindings)}`)
    }
  })
} catch (error) {
  console.error('❌ 初始化 MySQL 数据库连接池失败:', error.message)

  // 提供详细的错误信息和修复建议
  if (error.code === 'ENOTFOUND') {
    console.error('💡 修复建议: 数据库主机地址无法解析，请检查 DB_HOST 配置')
  } else if (error.code === 'ECONNREFUSED') {
    console.error('💡 修复建议: 数据库连接被拒绝，请检查数据库服务是否运行以及端口配置')
  } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('💡 修复建议: 数据库认证失败，请检查 DB_USER 和 DB_PASSWORD 配置')
  } else if (error.code === 'ER_BAD_DB_ERROR') {
    console.error('💡 修复建议: 数据库不存在，请检查 DB_NAME 配置')
  }

  process.exit(1)
}
// 连接 Redis 数据库
let redis
try {
  redis = new Redis(redisConfig)
  console.log('✅ Redis 连接初始化成功')

  // 输出 Redis 连接配置信息（隐藏敏感信息）
  console.log(`   Redis: ${redisConfig.host}:${redisConfig.port}/${redisConfig.db}`)
  console.log(`   键前缀: ${redisConfig.keyPrefix || '无'}`)

  // 添加 Redis 连接事件监听器
  redis.on('connect', () => {
    console.log('🔗 Redis 连接已建立')
  })

  redis.on('ready', () => {
    console.log('✅ Redis 连接就绪')
  })

  redis.on('error', (error) => {
    console.error('❌ Redis 连接错误:', error.message)

    // 提供详细的错误信息和修复建议
    if (error.code === 'ENOTFOUND') {
      console.error('💡 修复建议: Redis 主机地址无法解析，请检查 REDIS_HOST 配置')
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 修复建议: Redis 连接被拒绝，请检查 Redis 服务是否运行以及端口配置')
    } else if (error.message.includes('WRONGPASS')) {
      console.error('💡 修复建议: Redis 认证失败，请检查 REDIS_PASSWORD 配置')
    } else if (error.message.includes('NOAUTH')) {
      console.error('💡 修复建议: Redis 需要认证，请设置 REDIS_PASSWORD')
    }
  })

  redis.on('close', () => {
    console.log('🔌 Redis 连接已关闭')
  })

  redis.on('reconnecting', (delay) => {
    console.log(`🔄 Redis 重连中... (${delay}ms 后重试)`)
  })

} catch (error) {
  console.error('❌ 初始化 Redis 连接失败:', error.message)

  // 提供配置错误的修复建议
  if (error.message.includes('port')) {
    console.error('💡 修复建议: 请检查 REDIS_PORT 配置，确保端口号在有效范围内')
  }

  process.exit(1)
}
// 添加连接池状态监控方法
const getPoolStatus = async () => {
  try {
    const pool = db.client.pool
    return {
      total: pool.numUsed() + pool.numFree(),
      active: pool.numUsed(),
      idle: pool.numFree(),
      pending: pool.numPendingAcquires(),
      timeouts: pool.numPendingCreates(),
    }
  } catch (error) {
    console.error('获取连接池状态失败:', error)
    return { error: '获取连接池状态失败' }
  }
}

// 添加数据库连接测试方法
const testConnection = async () => {
  try {
    await db.raw('SELECT 1 as connection_test')
    return true
  } catch (error) {
    console.error('❌ 数据库连接测试失败:', error.message)
    return false
  }
}

// 添加 Redis 连接测试方法
const testRedisConnection = async () => {
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error('❌ Redis 连接测试失败:', error.message)
    return false
  }
}

// 添加完整的连接测试方法
const testAllConnections = async () => {
  const results = {
    database: await testConnection(),
    redis: await testRedisConnection()
  }

  const allConnected = Object.values(results).every(status => status === true)

  if (allConnected) {
    console.log('✅ 所有数据库连接测试通过')
  } else {
    console.error('❌ 部分数据库连接测试失败:', results)
  }

  return results
}

// 定期检查连接池状态
setInterval(async () => {
  const status = await getPoolStatus()
  if (status.error) {
    console.error('❌ 连接池状态检查失败:', status.error)
    return
  }

  // 检查连接池使用率
  if (status.active > poolConfig.max * 0.8) {
    console.warn(
      `⚠️  数据库连接池使用率较高: ${status.active}/${poolConfig.max} (${Math.round(status.active / poolConfig.max * 100)}%)`
    )
  }

  // 检查待处理连接数
  if (status.pending > 5) {
    console.warn(
      `⚠️  数据库连接池有 ${status.pending} 个待处理连接请求`
    )
  }

  // 在开发环境中输出详细状态
  if (config.app.env === 'development') {
    console.log(`[DB Pool] 活跃: ${status.active}, 空闲: ${status.idle}, 待处理: ${status.pending}`)
  }
}, 30000)

// 进程退出时关闭连接池
process.on('SIGINT', async () => {
  console.log('正在关闭数据库和 Redis 连接...')
  try {
    // 关闭数据库连接池
    await db.destroy()
    console.log('✅ 数据库连接池已关闭')

    // 关闭 Redis 连接
    redis.disconnect()
    console.log('✅ Redis 连接已关闭')

    process.exit(0)
  } catch (error) {
    console.error('❌ 关闭连接时出错:', error)
    process.exit(1)
  }
})

// 关闭数据库连接的函数
const closeDatabase = async () => {
  try {
    console.log('正在关闭数据库连接池...')
    await db.destroy()
    console.log('✅ 数据库连接池已关闭')
    return true
  } catch (error) {
    console.error('❌ 关闭数据库连接池时出错:', error)
    throw error
  }
}

// 关闭 Redis 连接的函数
const closeRedis = async () => {
  try {
    console.log('正在关闭 Redis 连接...')
    redis.disconnect()
    console.log('✅ Redis 连接已关闭')
    return true
  } catch (error) {
    console.error('❌ 关闭 Redis 连接时出错:', error)
    throw error
  }
}

// 关闭所有连接的函数
const closeAllConnections = async () => {
  try {
    await Promise.all([
      closeDatabase(),
      closeRedis()
    ])
    console.log('✅ 所有数据库连接已关闭')
    return true
  } catch (error) {
    console.error('❌ 关闭连接时出错:', error)
    throw error
  }
}

module.exports = {
  db,
  knex,
  redis,
  getPoolStatus,
  testConnection,
  testRedisConnection,
  testAllConnections,
  closeDatabase,
  closeRedis,
  closeAllConnections
}
