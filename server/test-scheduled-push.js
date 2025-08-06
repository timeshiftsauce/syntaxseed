/**
 * 定时推送服务测试脚本
 * 用于验证定时推送功能是否正常工作
 */

const scheduledPushService = require('./services/scheduledPushService')
const { testConnection } = require('./db')

async function testScheduledPushService() {
  console.log('🚀 开始测试定时推送服务...\n')

  try {
    // 0. 测试数据库连接
    console.log('0. 测试数据库连接...')
    const dbConnected = await testConnection()
    if (!dbConnected) {
      throw new Error('数据库连接失败')
    }
    console.log('✅ 数据库连接成功\n')

    // 1. 检查服务状态
    console.log('1. 检查定时推送服务状态...')
    console.log(`服务启用状态: ${scheduledPushService.isEnabled ? '已启用' : '已禁用'}`)

    const tasksStatus = scheduledPushService.getTasksStatus()
    console.log('任务状态:')
    Object.entries(tasksStatus).forEach(([name, status]) => {
      console.log(`  - ${name}: ${status.running ? '运行中' : '已停止'}`)
    })
    console.log('✅ 服务状态检查完成\n')

    // 2. 获取下次执行时间
    console.log('2. 获取任务执行时间...')
    const nextTimes = scheduledPushService.getNextExecutionTimes()
    console.log('任务执行时间:')
    Object.entries(nextTimes).forEach(([name, time]) => {
      console.log(`  - ${name}: ${time}`)
    })
    console.log('✅ 执行时间获取完成\n')

    // 3. 测试手动执行任务（只推送新增URL）
    console.log('3. 测试手动执行推送任务...')
    try {
      const result = await scheduledPushService.executeTask('morningPush')
      if (result.success) {
        console.log('✅ 手动执行推送任务成功')
        if (result.result.newUrlsCount > 0) {
          console.log(`   推送了 ${result.result.newUrlsCount} 个新增URL`)
        } else {
          console.log('   没有新增URL需要推送')
        }
      } else {
        console.log('❌ 手动执行推送任务失败:', result.message)
      }
    } catch (error) {
      console.log('❌ 手动执行推送任务出错:', error.message)
    }
    console.log()

    // 4. 测试任务控制功能
    console.log('4. 测试任务控制功能...')

    // 停止一个任务
    const stopResult = scheduledPushService.stopTask('eveningPush')
    console.log(`停止eveningPush任务: ${stopResult ? '成功' : '失败'}`)

    // 重新启动任务
    const startResult = scheduledPushService.startTask('eveningPush')
    console.log(`启动eveningPush任务: ${startResult ? '成功' : '失败'}`)

    console.log('✅ 任务控制功能测试完成\n')

    // 5. 显示任务配置信息
    console.log('5. 任务配置信息...')
    const taskConfigs = [
      {
        name: 'sitemapAndPush',
        description: '生成sitemap并推送新增URL',
        schedule: '每天凌晨2点 (0 2 * * *)',
        timezone: 'Asia/Shanghai'
      },
      {
        name: 'morningPush',
        description: '推送新增URL',
        schedule: '每天上午10点 (0 10 * * *)',
        timezone: 'Asia/Shanghai'
      },
      {
        name: 'eveningPush',
        description: '推送新增URL',
        schedule: '每天下午6点 (0 18 * * *)',
        timezone: 'Asia/Shanghai'
      }
    ]

    taskConfigs.forEach(config => {
      console.log(`📅 ${config.name}:`)
      console.log(`   描述: ${config.description}`)
      console.log(`   计划: ${config.schedule}`)
      console.log(`   时区: ${config.timezone}`)
    })
    console.log('✅ 任务配置信息显示完成\n')

    console.log('🎉 所有测试完成！')

    console.log('\n📋 使用说明:')
    console.log('1. 定时推送服务会在服务器启动时自动启动')
    console.log('2. 可以通过API接口管理定时任务:')
    console.log('   - GET /api/scheduled-push/status - 获取任务状态')
    console.log('   - POST /api/scheduled-push/execute/:taskName - 手动执行任务')
    console.log('   - POST /api/scheduled-push/start/:taskName - 启动任务')
    console.log('   - POST /api/scheduled-push/stop/:taskName - 停止任务')
    console.log('3. 任务会自动推送新增URL到百度搜索引擎')
    console.log('4. 建议配置百度推送Token以启用实际推送功能')

  } catch (error) {
    console.error('❌ 测试失败:', error)
    console.error('错误详情:', error.stack)
    process.exit(1)
  }
}

// 运行测试
if (require.main === module) {
  testScheduledPushService().then(() => {
    console.log('\n测试完成，正在退出...')
    process.exit(0)
  })
}

module.exports = { testScheduledPushService }