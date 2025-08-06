/**
 * 百度推送服务测试脚本
 * 用于验证百度推送功能是否正常工作
 */

const baiduPushService = require('./services/baiduPushService')
const sitemapService = require('./services/sitemapService')
const { testConnection } = require('./db')

async function testBaiduPushService() {
  console.log('🚀 开始测试百度推送服务...\n')

  try {
    // 0. 测试数据库连接
    console.log('0. 测试数据库连接...')
    const dbConnected = await testConnection()
    if (!dbConnected) {
      throw new Error('数据库连接失败')
    }
    console.log('✅ 数据库连接成功\n')

    // 1. 检查配置
    console.log('1. 检查百度推送配置...')
    console.log(`站点: ${baiduPushService.site}`)
    console.log(`Token配置: ${baiduPushService.token ? '已配置' : '未配置'}`)
    console.log(`API地址: ${baiduPushService.apiUrl}`)
    console.log(`每次最大推送数量: ${baiduPushService.maxUrlsPerRequest}`)

    if (!baiduPushService.token) {
      console.log('⚠️  警告: 百度推送Token未配置，请设置环境变量 BAIDU_TOKEN')
      console.log('可以继续测试其他功能，但无法实际推送到百度\n')
    } else {
      console.log('✅ 百度推送配置检查完成\n')
    }

    // 2. 测试获取URL列表
    console.log('2. 测试获取URL列表...')
    const allUrls = await sitemapService.getAllUrls()
    console.log(`获取到 ${allUrls.length} 个URL`)
    console.log('前5个URL:')
    allUrls.slice(0, 5).forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`)
    })
    console.log('✅ URL列表获取成功\n')

    // 3. 测试推送历史记录
    console.log('3. 测试推送历史记录...')
    const history = await baiduPushService.getPushHistory(5)
    console.log(`历史记录数量: ${history.length}`)
    if (history.length > 0) {
      console.log('最近的推送记录:')
      history.forEach((record, index) => {
        console.log(`  ${index + 1}. ${record.timestamp} - ${record.success ? '成功' : '失败'} - ${record.urlCount}个URL`)
      })
    }
    console.log('✅ 推送历史记录测试完成\n')

    // 4. 测试推送统计
    console.log('4. 测试推送统计...')
    const stats = await baiduPushService.getPushStats()
    console.log('推送统计信息:')
    console.log(`  总推送次数: ${stats.totalPushes}`)
    console.log(`  今日推送次数: ${stats.todayPushes}`)
    console.log(`  成功推送次数: ${stats.successfulPushes}`)
    console.log(`  失败推送次数: ${stats.failedPushes}`)
    console.log(`  总推送URL数: ${stats.totalUrlsPushed}`)
    console.log(`  今日推送URL数: ${stats.todayUrlsPushed}`)
    console.log(`  成功率: ${stats.successRate}%`)
    console.log(`  最后推送时间: ${stats.lastPushTime || '无'}`)
    console.log('✅ 推送统计测试完成\n')

    // 5. 测试新增URL检测
    console.log('5. 测试新增URL检测...')
    const lastPushedUrls = await sitemapService.getLastPushedUrls()
    console.log(`上次推送的URL数量: ${lastPushedUrls.length}`)

    const newUrls = allUrls.filter(url => !lastPushedUrls.includes(url))
    console.log(`新增URL数量: ${newUrls.length}`)

    if (newUrls.length > 0) {
      console.log('新增URL列表:')
      newUrls.slice(0, 5).forEach((url, index) => {
        console.log(`  ${index + 1}. ${url}`)
      })
      if (newUrls.length > 5) {
        console.log(`  ... 还有 ${newUrls.length - 5} 个`)
      }
    }
    console.log('✅ 新增URL检测完成\n')

    // 6. 测试配置验证（如果Token已配置）
    if (baiduPushService.token) {
      console.log('6. 测试百度推送配置验证...')
      try {
        const testResult = await baiduPushService.testConfiguration()
        if (testResult.success) {
          console.log('✅ 百度推送配置验证成功')
          console.log(`测试URL: ${testResult.testUrl}`)
        } else {
          console.log('❌ 百度推送配置验证失败')
          console.log(`错误: ${testResult.error}`)
        }
      } catch (error) {
        console.log('❌ 百度推送配置验证出错:', error.message)
      }
      console.log()
    }

    console.log('🎉 所有测试完成！')

    if (!baiduPushService.token) {
      console.log('\n📝 使用说明:')
      console.log('1. 请在百度搜索资源平台获取API推送Token')
      console.log('2. 设置环境变量 BAIDU_TOKEN=your_token_here')
      console.log('3. 设置环境变量 BAIDU_SITE=your_domain.com')
      console.log('4. 重新运行测试或启动服务器')
    } else {
      console.log('\n🚀 百度推送服务已就绪，可以开始使用！')
      console.log('API接口:')
      console.log('- GET /api/baidu-push/status - 获取推送状态')
      console.log('- POST /api/baidu-push/push-all - 推送所有URL')
      console.log('- POST /api/baidu-push/push-new - 推送新增URL')
      console.log('- GET /api/baidu-push/history - 获取推送历史')
    }

  } catch (error) {
    console.error('❌ 测试失败:', error)
    console.error('错误详情:', error.stack)
    process.exit(1)
  }
}

// 运行测试
if (require.main === module) {
  testBaiduPushService().then(() => {
    console.log('\n测试完成，正在退出...')
    process.exit(0)
  })
}

module.exports = { testBaiduPushService }