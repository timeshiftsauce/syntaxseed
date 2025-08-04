#!/usr/bin/env node

/**
 * 服务器启动脚本
 * 支持单进程和集群模式
 */

const { spawn } = require('child_process')
const path = require('path')

// 加载配置
const { config, displayConfig, isClusterEnabled, isDevelopment } = require('./config/env')

// 解析命令行参数
const args = process.argv.slice(2)
const forceCluster = args.includes('--cluster')
const forceSingle = args.includes('--single')

// 确定运行模式
let useCluster = isClusterEnabled
if (forceCluster) useCluster = true
if (forceSingle) useCluster = false

// 启动配置
const startConfig = {
  script: path.join(__dirname, useCluster ? 'cluster.js' : 'index.js'),
  env: {
    ...process.env,
    CLUSTER_ENABLED: useCluster ? 'true' : 'false',
  },
}

console.log('🚀 启动 SyntaxSeed 后端服务')
console.log(`📦 模式: ${useCluster ? '集群模式' : '单进程模式'}`)
console.log(`🌍 环境: ${config.NODE_ENV}`)
console.log(`📁 脚本: ${startConfig.script}`)

// 显示配置信息
if (!useCluster) {
  displayConfig()
}

// 启动服务器
const serverProcess = spawn('node', [startConfig.script], {
  stdio: 'inherit',
  env: startConfig.env,
})

// 处理进程事件
serverProcess.on('error', (error) => {
  console.error('❌ 启动服务器失败:', error)
  process.exit(1)
})

serverProcess.on('exit', (code, signal) => {
  if (code !== 0) {
    console.error(`❌ 服务器异常退出 (code: ${code}, signal: ${signal})`)
    process.exit(code)
  } else {
    console.log('✅ 服务器正常退出')
  }
})

// 优雅关闭处理
process.on('SIGTERM', () => {
  console.log('🛑 收到 SIGTERM 信号，正在关闭服务器...')
  serverProcess.kill('SIGTERM')
})

process.on('SIGINT', () => {
  console.log('🛑 收到 SIGINT 信号，正在关闭服务器...')
  serverProcess.kill('SIGINT')
})

// 未捕获异常处理
process.on('uncaughtException', (error) => {
  console.error('❌ 启动脚本未捕获异常:', error)
  serverProcess.kill('SIGTERM')
  process.exit(1)
})