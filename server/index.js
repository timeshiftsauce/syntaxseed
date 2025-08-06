const express = require('express')
const cluster = require('cluster')
const cors = require('cors')
const session = require("express-session")


// 加载配置
const { config, PORT, isDevelopment } = require('./config/env')

const app = express()
const getDataRouter = require('./getData/index.js')
const authRouter = require('./auth/Auth.js')
const { errorHandler } = require('./middleware/errorHandler')

const {
  globalLimiter,
  apiLimiter,
  adminLimiter,
} = require('./middleware/rateLimiter')
const {
  loggingMiddleware,
} = require('./middleware/loggingMiddleware')
const { testConnection } = require('./db')

// 集群相关变量
const isWorker = cluster.isWorker
const workerId = cluster.worker ? cluster.worker.id : 'master'
const workerPid = process.pid

// 基础中间件
app.use(cors())
app.use(express.json({ limit: '10mb' })) // 限制请求体大小

// 静态文件服务 - 提供sitemap.xml
app.use(express.static('public'))
app.use(session({
  secret: "!@#$646456456456fjsjfkojskolf%",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}))
// 全局限流中间件
app.use(globalLimiter)

// 请求日志中间件
app.use(loggingMiddleware)

// 数据库状态端点
app.get('/db-status', async (req, res) => {
  try {
    const { getPoolStatus } = require('./db')
    const poolStatus = await getPoolStatus()

    res.status(200).json({
      timestamp: new Date().toISOString(),
      database: {
        pool: poolStatus,
      },
    })
  } catch (error) {
    console.error('获取数据库状态失败:', error)
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: '获取数据库状态失败',
      message: error.message,
    })
  }
})

// 健康检查端点
app.get('/health', async (req, res) => {
  try {
    // 检查数据库连接
    const dbStatus = await testConnection()

    // 获取数据库连接池状态
    const { getPoolStatus } = require('./db')
    const poolStatus = await getPoolStatus()

    // 获取系统资源使用情况
    const os = require('os')
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const memUsage = process.memoryUsage()

    // 获取进程信息
    const processInfo = {
      pid: process.pid,
      workerId: workerId,
      isWorker: isWorker,
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)} MB`,
        arrayBuffers: `${Math.round((memUsage.arrayBuffers || 0) / 1024 / 1024)} MB`,
      },
    }

    // 向主进程发送健康检查消息
    if (isWorker && process.send) {
      process.send({
        type: 'health-check',
        status: dbStatus ? 'healthy' : 'unhealthy',
        workerId: workerId,
        pid: workerPid,
      })
    }

    // 返回健康状态
    res.status(dbStatus ? 200 : 503).json({
      status: dbStatus ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      cluster: {
        isWorker: isWorker,
        workerId: workerId,
        pid: workerPid,
      },
      server: {
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        loadAvg: os.loadavg(),
        memory: {
          total: `${Math.round(totalMem / 1024 / 1024)} MB`,
          free: `${Math.round(freeMem / 1024 / 1024)} MB`,
          used: `${Math.round(usedMem / 1024 / 1024)} MB`,
          usagePercent: `${Math.round((usedMem / totalMem) * 100)}%`,
        },
      },
      process: processInfo,
      database: {
        status: dbStatus ? 'connected' : 'disconnected',
        pool: poolStatus,
      },
    })
  } catch (error) {
    console.error('健康检查失败:', error)
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: '健康检查执行失败',
      message: error.message,
    })
  }
})

// API 健康检查端点（与 /health 相同，用于 Docker 健康检查）
app.get('/api/health', async (req, res) => {
  try {
    // 检查数据库连接
    const dbStatus = await testConnection()

    // 获取数据库连接池状态
    const { getPoolStatus } = require('./db')
    const poolStatus = await getPoolStatus()

    // 获取系统资源使用情况
    const os = require('os')
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const memUsage = process.memoryUsage()

    // 获取进程信息
    const processInfo = {
      pid: process.pid,
      workerId: workerId,
      isWorker: isWorker,
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)} MB`,
        arrayBuffers: `${Math.round((memUsage.arrayBuffers || 0) / 1024 / 1024)} MB`,
      },
    }

    // 向主进程发送健康检查消息
    if (isWorker && process.send) {
      process.send({
        type: 'health-check',
        status: dbStatus ? 'healthy' : 'unhealthy',
        workerId: workerId,
        pid: workerPid,
      })
    }

    // 返回健康状态
    res.status(dbStatus ? 200 : 503).json({
      status: dbStatus ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      cluster: {
        isWorker: isWorker,
        workerId: workerId,
        pid: workerPid,
      },
      server: {
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        loadAvg: os.loadavg(),
        memory: {
          total: `${Math.round(totalMem / 1024 / 1024)} MB`,
          free: `${Math.round(freeMem / 1024 / 1024)} MB`,
          used: `${Math.round(usedMem / 1024 / 1024)} MB`,
          usagePercent: `${Math.round((usedMem / totalMem) * 100)}%`,
        },
      },
      process: processInfo,
      database: {
        status: dbStatus ? 'connected' : 'disconnected',
        pool: poolStatus,
      },
    })
  } catch (error) {
    console.error('API 健康检查失败:', error)
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'API 健康检查执行失败',
      message: error.message,
    })
  }
})

// 集群状态端点（仅在工作进程中提供）
if (isWorker) {
  app.get('/cluster-status', (req, res) => {
    try {
      const clusterInfo = {
        workerId: workerId,
        pid: workerPid,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString(),
      }

      res.status(200).json({
        status: 'ok',
        cluster: clusterInfo,
      })
    } catch (error) {
      console.error('获取集群状态失败:', error)
      res.status(500).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: '获取集群状态失败',
        message: error.message,
      })
    }
  })
}

// API路由（应用API限流）
app.use('/api', apiLimiter, getDataRouter)
// 认证路由（模拟版本，不使用数据库）
app.use('/api/auth', authRouter)
// Sitemap路由

const site = require('./getData/sitemap.js')
const baiduPush = require('./getData/baiduPush.js')
const scheduledPush = require('./getData/scheduledPush.js')
const searchEnginePush = require('./getData/searchEnginePush.js')

app.use('/api/sitemap', site)
app.use('/api/baidu-push', baiduPush)
app.use('/api/scheduled-push', scheduledPush)
app.use('/api/search-engine-push', searchEnginePush)


// 404处理
app.all(/(.*)/, (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.status(200).send('哇！抓到一只迷路的小猫咪')
})

// 全局错误处理中间件
app.use(errorHandler)

// 未捕获的异常处理
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err)
  // 记录错误并优雅退出
  process.exit(1)
})

// 未处理的Promise拒绝处理
process.on('unhandledRejection', (err) => {
  console.error('未处理的Promise拒绝:', err)
  // 记录错误但不退出进程
})

// 启动服务器
const server = app.listen(PORT, () => {
  const processType = isWorker ? `工作进程 ${workerId} (PID: ${workerPid})` : '单进程模式'
  console.log(`${processType} 服务器已启动: http://localhost:${PORT}`)
  console.log(`健康检查: http://localhost:${PORT}/health`)

  // 初始化sitemap和推送服务（只在主进程或单进程模式下启动）
  if (!isWorker || workerId === 1) {
    try {
      const sitemapService = require('./services/sitemapService')
      const scheduledPushService = require('./services/scheduledPushService')
      const { initSitemap } = require('./scripts/initSitemap')

      // 启动sitemap定期生成任务
      sitemapService.startScheduledGeneration()
      console.log('Sitemap定期生成服务已启动')

      // 启动定时推送任务
      scheduledPushService.startAllTasks()

      // 初始化sitemap（异步执行，不阻塞服务器启动）
      initSitemap().catch(error => {
        console.error('初始化sitemap失败:', error)
      })
    } catch (error) {
      console.error('启动sitemap和推送服务失败:', error)
    }
  }

  // 工作进程启动后发送就绪消息
  if (isWorker && process.send) {
    process.send({
      type: 'worker-ready',
      workerId: workerId,
      pid: workerPid,
    })
  }
})

// 工作进程消息处理
if (isWorker) {
  process.on('message', (message) => {
    if (message.type === 'shutdown') {
      console.log(`工作进程 ${workerId} 收到关闭信号，正在优雅关闭...`)
      gracefulShutdown()
    }
  })
}

// 优雅关闭函数
function gracefulShutdown() {
  console.log(`${isWorker ? `工作进程 ${workerId}` : '服务器'} 正在优雅关闭...`)

  // 停止接受新连接
  server.close(() => {
    console.log(`${isWorker ? `工作进程 ${workerId}` : '服务器'} 已关闭`)

    // 关闭数据库连接
    const { closeDatabase } = require('./db')
    closeDatabase().then(() => {
      console.log('数据库连接已关闭')
      process.exit(0)
    }).catch((err) => {
      console.error('关闭数据库连接时出错:', err)
      process.exit(1)
    })
  })

  // 设置强制退出超时
  setTimeout(() => {
    console.error('强制退出进程')
    process.exit(1)
  }, 10000)
}

// 优雅关闭信号处理
process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
