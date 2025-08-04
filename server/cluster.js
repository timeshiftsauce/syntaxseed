const cluster = require('cluster')
const os = require('os')
const path = require('path')

// 加载配置
const { config, validateConfig, displayConfig, isClusterEnabled } = require('./config/env')

// 验证配置
validateConfig()

// 集群配置
const CLUSTER_CONFIG = config.cluster

// 工作进程重启计数器
const workerRestarts = new Map()

/**
 * 启动集群主进程
 */
function startCluster() {
  console.log(`🚀 集群主进程启动 (PID: ${process.pid})`)
  console.log(`📊 CPU 核心数: ${os.cpus().length}`)
  console.log(`👥 工作进程数: ${CLUSTER_CONFIG.workers}`)

  // 设置工作进程的执行文件
  cluster.setupPrimary({
    exec: path.join(__dirname, 'index.js'),
  })

  // 启动工作进程
  for (let i = 0; i < CLUSTER_CONFIG.workers; i++) {
    forkWorker()
  }

  // 监听工作进程退出事件
  cluster.on('exit', (worker, code, signal) => {
    console.log(`⚠️  工作进程 ${worker.process.pid} 已退出 (code: ${code}, signal: ${signal})`)

    // 检查是否需要重启
    if (shouldRestartWorker(worker)) {
      console.log(`🔄 正在重启工作进程...`)
      setTimeout(() => {
        forkWorker()
      }, CLUSTER_CONFIG.restartDelay)
    } else {
      console.log(`❌ 工作进程 ${worker.process.pid} 重启次数过多，停止重启`)
    }
  })

  // 监听工作进程在线事件
  cluster.on('online', (worker) => {
    console.log(`✅ 工作进程 ${worker.process.pid} 已上线`)
  })

  // 监听工作进程断开连接事件
  cluster.on('disconnect', (worker) => {
    console.log(`🔌 工作进程 ${worker.process.pid} 已断开连接`)
  })

  // 优雅关闭处理
  process.on('SIGTERM', gracefulShutdown)
  process.on('SIGINT', gracefulShutdown)

  // 未捕获异常处理
  process.on('uncaughtException', (err) => {
    console.error('❌ 主进程未捕获异常:', err)
    gracefulShutdown()
  })

  // 未处理的Promise拒绝
  process.on('unhandledRejection', (err) => {
    console.error('❌ 主进程未处理的Promise拒绝:', err)
  })
}

/**
 * 创建新的工作进程
 */
function forkWorker() {
  const worker = cluster.fork()

  // 初始化重启计数
  workerRestarts.set(worker.id, 0)

  // 监听工作进程消息
  worker.on('message', (message) => {
    if (message.type === 'health-check') {
      console.log(`💓 工作进程 ${worker.process.pid} 健康检查: ${message.status}`)
    }
  })

  return worker
}

/**
 * 判断是否应该重启工作进程
 */
function shouldRestartWorker(worker) {
  const restartCount = workerRestarts.get(worker.id) || 0

  if (restartCount >= CLUSTER_CONFIG.maxRestarts) {
    workerRestarts.delete(worker.id)
    return false
  }

  workerRestarts.set(worker.id, restartCount + 1)
  return true
}

/**
 * 优雅关闭集群
 */
function gracefulShutdown() {
  console.log('🛑 收到关闭信号，正在优雅关闭集群...')

  const workers = Object.values(cluster.workers)
  let shutdownCount = 0

  if (workers.length === 0) {
    console.log('✅ 集群已关闭')
    process.exit(0)
  }

  // 向所有工作进程发送关闭信号
  workers.forEach((worker) => {
  })

  // 监听工作进程关闭
  cluster.on('exit', () => {
    shutdownCount++
    if (shutdownCount === workers.length) {
      console.log('✅ 所有工作进程已关闭')
      process.exit(0)
    }
  })
}

/**
 * 获取集群状态
 */
function getClusterStatus() {
  const workers = Object.values(cluster.workers)

  return {
    master: {
      pid: process.pid,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    },
    workers: workers.map(worker => ({
      id: worker.id,
      pid: worker.process.pid,
      state: worker.state,
      isDead: worker.isDead(),
    })),
    config: CLUSTER_CONFIG,
  }
}

// 如果是主进程且启用了集群模式
if (cluster.isPrimary && isClusterEnabled) {
  // 显示配置信息
  displayConfig()
  startCluster()
} else {
  // 工作进程或单进程模式，直接启动应用
  require('./index.js')
}

module.exports = {
  getClusterStatus,
  CLUSTER_CONFIG,
}