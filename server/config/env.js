/**
 * 环境配置管理模块
 * 统一管理所有环境变量配置
 * 
 * 重构说明：
 * - 集成新的 ConfigManager 配置管理系统
 * - 保持向后兼容性，支持现有的配置访问方式
 * - 添加配置迁移检查和警告机制
 * - 更新 getDatabaseOverrides() 函数，使用新的环境变量映射
 * - 支持优雅降级：新配置系统失败时自动回退到传统配置
 * 
 * 配置优先级（新系统）：
 * 1. 环境变量 (Docker/系统级)
 * 2. .env 文件 (开发环境)
 * 3. YAML 配置文件 (默认值)
 * 4. 代码中的硬编码默认值
 * 
 * 向后兼容性：
 * - 所有现有的导出接口保持不变
 * - 传统配置访问方式继续工作
 * - 新增便捷访问方法，但不影响现有代码
 */

// 加载环境变量
require('dotenv').config()

// 引入新的配置管理系统
const ConfigManager = require('./ConfigManager')

// 配置迁移检查和警告机制
function checkLegacyConfig() {
  const warnings = []

  // 检查过时的环境变量
  if (process.env.HEARD) {
    warnings.push('HEARD 已弃用，请使用 REDIS_PREFIX 替代')
  }

  if (process.env.JWT_ACC_SECRET) {
    warnings.push('JWT_ACC_SECRET 已弃用，请使用 JWT_ACCESS_SECRET 替代')
  }

  if (process.env.JWT_REF_SECRET) {
    warnings.push('JWT_REF_SECRET 已弃用，请使用 JWT_REFRESH_SECRET 替代')
  }

  if (process.env.JWT_ACC_EXPIRES_IN) {
    warnings.push('JWT_ACC_EXPIRES_IN 已弃用，请使用 JWT_ACCESS_EXPIRES_IN 替代')
  }

  if (process.env.JWT_REF_EXPIRES_IN) {
    warnings.push('JWT_REF_EXPIRES_IN 已弃用，请使用 JWT_REFRESH_EXPIRES_IN 替代')
  }

  // 输出警告信息
  if (warnings.length > 0) {
    console.warn('⚠️  配置迁移警告:')
    warnings.forEach((warning) => console.warn(`  • ${warning}`))
  }
}

// 执行配置迁移检查
checkLegacyConfig()

// 加载新的配置管理系统
let modernConfig
try {
  modernConfig = ConfigManager.loadConfig()
} catch (error) {
  console.error('❌ 新配置系统加载失败，回退到传统配置:', error.message)
  modernConfig = null
}

// 传统配置对象（保持向后兼容）
const legacyConfig = {
  // 基础配置
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 7204,

  // 集群配置
  cluster: {
    enabled: process.env.CLUSTER_ENABLED === 'true',
    workers: parseInt(process.env.CLUSTER_WORKERS) || require('os').cpus().length,
    restartDelay: parseInt(process.env.CLUSTER_RESTART_DELAY) || 1000,
    maxRestarts: parseInt(process.env.CLUSTER_MAX_RESTARTS) || 5,
  },

  // 数据库配置（可选，覆盖 yaml 配置）
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // 限流配置
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15分钟
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // 会话配置
  session: {
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  },

  // JWT配置
  jwt: {
    accessTokenSecret: process.env.JWT_ACC_SECRET,
    refreshTokenSecret: process.env.JWT_REF_SECRET,
    accessTokenExpires: parseInt(process.env.JWT_ACC_EXPIRES_IN),
    refreshTokenExpires: parseInt(process.env.JWT_REF_EXPIRES_IN)
  },

  // 监控配置
  monitor: {
    interval: parseInt(process.env.MONITOR_INTERVAL) || 5000,
    healthCheckTimeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 5000,
  },

  // 性能配置
  performance: {
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
    keepAliveTimeout: parseInt(process.env.KEEP_ALIVE_TIMEOUT) || 5000,
  },
  redis: {
    head: process.env.HEARD
  },

  // 邮件配置
  mail: {
    host: process.env.MAIL_HOST || 'smtp.qq.com',
    port: parseInt(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
    from: process.env.MAIL_FROM || 'SyntaxSeed <noreply@syntaxseed.com>'
  }
}

// 统一配置对象：优先使用新配置系统，回退到传统配置
const config = modernConfig || legacyConfig
console.log("config******",config)
// 验证必要的配置
function validateConfig() {
  let errors = []

  // 如果使用新配置系统，使用其验证功能
  if (modernConfig) {
    try {
      errors = ConfigManager.validate()
    } catch (error) {
      console.error('❌ 新配置系统验证失败:', error.message)
      errors = [`配置系统验证错误: ${error.message}`]
    }
  } else {
    // 传统验证逻辑（向后兼容）
    const currentConfig = config.app || config

    // 检查端口
    const port = currentConfig.port || currentConfig.PORT
    if (port < 1 || port > 65535) {
      errors.push('PORT 必须在 1-65535 范围内')
    }

    // 检查工作进程数
    const workers = currentConfig.cluster?.workers || config.cluster?.workers
    if (workers < 1 || workers > 32) {
      errors.push('CLUSTER_WORKERS 必须在 1-32 范围内')
    }

    // 检查会话密钥
    const env = currentConfig.env || currentConfig.NODE_ENV
    const sessionSecret = config.session?.secret
    if (env === 'production' && sessionSecret === 'your-secret-key-here') {
      errors.push('生产环境必须设置 SESSION_SECRET')
    }

    // 检查JWT密钥
    const jwtAccessSecret = config.jwt?.access?.secret || config.jwt?.accessTokenSecret
    if (env === 'production' && (!jwtAccessSecret || jwtAccessSecret === 'your-jwt-secret-here')) {
      errors.push('生产环境必须设置 JWT_ACCESS_SECRET')
    }
  }

  if (errors.length > 0) {
    console.error('❌ 配置验证失败:')
    errors.forEach(error => console.error(`  • ${error}`))
    process.exit(1)
  }
}

// 显示配置信息
function displayConfig() {
  console.log('⚙️  环境配置:')

  if (modernConfig) {
    // 使用新配置系统的结构
    const appConfig = modernConfig.app || {}
    console.log(`  NODE_ENV: ${appConfig.env || 'development'}`)
    console.log(`  PORT: ${appConfig.port || 7204}`)
    console.log(`  CLUSTER_ENABLED: ${appConfig.cluster?.enabled || false}`)
    console.log(`  CLUSTER_WORKERS: ${appConfig.cluster?.workers || require('os').cpus().length}`)

    if (appConfig.env === 'development') {
      const loggingConfig = modernConfig.logging || {}
      const rateLimitConfig = modernConfig.rateLimit || {}
      console.log(`  LOG_LEVEL: ${loggingConfig.level || 'info'}`)
      console.log(`  RATE_LIMIT: ${rateLimitConfig.maxRequests || 100}/${rateLimitConfig.windowMs || 900000}ms`)
    }
  } else {
    // 传统配置显示（向后兼容）
    console.log(`  NODE_ENV: ${config.NODE_ENV}`)
    console.log(`  PORT: ${config.PORT}`)
    console.log(`  CLUSTER_ENABLED: ${config.cluster.enabled}`)
    console.log(`  CLUSTER_WORKERS: ${config.cluster.workers}`)

    if (config.NODE_ENV === 'development') {
      console.log(`  LOG_LEVEL: ${config.logging.level}`)
      console.log(`  RATE_LIMIT: ${config.rateLimit.maxRequests}/${config.rateLimit.windowMs}ms`)
    }
  }
}

// 获取数据库配置（如果环境变量中有设置）
function getDatabaseOverrides() {
  if (modernConfig) {
    // 使用新配置系统的环境变量映射
    try {
      const databaseConfig = ConfigManager.getDatabaseConfig()

      if (databaseConfig && databaseConfig.connection) {
        const overrides = {}
        const connection = databaseConfig.connection

        // 只返回通过环境变量设置的配置项
        if (process.env.DB_HOST) overrides.host = connection.host
        if (process.env.DB_PORT) overrides.port = connection.port
        if (process.env.DB_USER) overrides.user = connection.user
        if (process.env.DB_PASSWORD) overrides.password = connection.password
        if (process.env.DB_NAME) overrides.database = connection.database
        if (process.env.DB_CHARSET) overrides.charset = connection.charset
        if (process.env.DB_TIMEZONE) overrides.timezone = connection.timezone

        return Object.keys(overrides).length > 0 ? overrides : null
      }
    } catch (error) {
      console.warn('⚠️  获取新配置系统数据库配置失败，使用传统方式:', error.message)
    }
  }

  // 传统方式（向后兼容）
  const overrides = {}
  const dbConfig = config.database || {}

  if (dbConfig.host) overrides.host = dbConfig.host
  if (dbConfig.port) overrides.port = dbConfig.port
  if (dbConfig.user) overrides.user = dbConfig.user
  if (dbConfig.password) overrides.password = dbConfig.password
  if (dbConfig.database) overrides.database = dbConfig.database

  return Object.keys(overrides).length > 0 ? overrides : null
}

// 便捷访问函数（支持新旧配置系统）
function getConfigValue(path, fallback) {
  if (modernConfig) {
    return ConfigManager.get(path) || fallback
  }

  // 传统配置访问
  const keys = path.split('.')
  let value = config
  for (const key of keys) {
    value = value?.[key]
  }
  return value !== undefined ? value : fallback
}

// 导出配置
module.exports = {
  config,
  validateConfig,
  displayConfig,
  getDatabaseOverrides,
  checkLegacyConfig,

  // 新配置系统访问
  ConfigManager: modernConfig ? ConfigManager : null,
  isModernConfig: !!modernConfig,

  // 便捷访问（保持向后兼容）
  NODE_ENV: getConfigValue('app.env', config.NODE_ENV),
  PORT: getConfigValue('app.port', config.PORT),
  isProduction: getConfigValue('app.env', config.NODE_ENV) === 'production',
  isDevelopment: getConfigValue('app.env', config.NODE_ENV) === 'development',
  isClusterEnabled: getConfigValue('app.cluster.enabled', config.cluster?.enabled),

  // 新增便捷访问方法
  getConfig: (path, fallback) => getConfigValue(path, fallback),
  getDatabaseConfig: () => modernConfig ? ConfigManager.getDatabaseConfig() : config.database,
  getRedisConfig: () => modernConfig ? ConfigManager.getRedisConfig() : config.redis,
  getJWTConfig: () => modernConfig ? ConfigManager.getJWTConfig() : config.jwt,
  getMailConfig: () => modernConfig ? ConfigManager.getMailConfig() : config.mail,
}