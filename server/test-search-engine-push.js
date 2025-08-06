/**
 * 统一搜索引擎推送服务测试脚本
 * 用于验证百度和Bing推送功能是否正常工作
 */

const searchEnginePushService = require('./services/searchEnginePushService')
const bingPushService = require('./services/bingPushService')
const sitemapService = require('./services/sitemapService')
const { testConnection } = require('./db')

async function testSearchEnginePushService() {
  console.log('🚀 开始测试统一搜索引擎推送服务...\n')

  try {
    // 0. 测试数据库连接
    console.log('0. 测试数据库连接...')
    const dbConnected = await testConnection()
    if (!dbConnected) {
      throw new Error('数据库连接失败')
    }
    console.log('✅ 数据库连接成功\n')

    // 1. 检查搜索引擎配置状态
    console.log('1. 检查搜索引擎配置状态...')
    const enginesStatus = searchEnginePushService.getEnginesStatus()

    console.log('搜索引擎状态:')
    Object.entries(enginesStatus).forEach(([engine, status]) => {
      console.log(`  ${engine.toUpperCase()}:`)
      console.log(`    启用状态: ${status.enabled ? '已启用' : '已禁用'}`)
      console.log(`    配置状态: ${status.configured ? '已配置' : '未配置'}`)
      console.log(`    站点: ${status.site || status.siteUrl}`)
      console.log(`    每次最大推送: ${status.maxUrlsPerRequest} 个URL`)
    })
    console.log('✅ 搜索引擎配置状态检查完成\n')

    // 2. 测试获取URL列表
    console.log('2. 测试获取URL列表...')
    const allUrls = await sitemapService.getAllUrls()
    console.log(`获取到 ${allUrls.length} 个URL`)
    console.log('前5个URL:')
    allUrls.slice(0, 5).forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`)
    })
    console.log('✅ URL列表获取成功\n')

    // 3. 测试搜索引擎推送统计
    console.log('3. 测试搜索引擎推送统计...')
    const stats = await searchEnginePushService.getAllEnginesStats()

    console.log('推送统计汇总:')
    console.log(`  总搜索引擎数: ${stats.summary.totalEngines}`)
    console.log(`  已启用搜索引擎: ${stats.summary.enabledEngines}`)
    console.log(`  已配置搜索引擎: ${stats.summary.configuredEngines}`)

    if (stats.baidu) {
      console.log('  百度推送统计:')
      if (stats.baidu.error) {
        console.log(`    错误: ${stats.baidu.error}`)
      } else {
        console.log(`    总推送次数: ${stats.baidu.totalPushes}`)
        console.log(`    成功率: ${stats.baidu.successRate}%`)
        console.log(`    今日推送: ${stats.baidu.todayPushes}`)
      }
    }

    if (stats.bing) {
      console.log('  Bing推送统计:')
      if (stats.bing.error) {
        console.log(`    错误: ${stats.bing.error}`)
      } else {
        console.log(`    总推送次数: ${stats.bing.totalPushes}`)
        console.log(`    成功率: ${stats.bing.successRate}%`)
        console.log(`    今日推送: ${stats.bing.todayPushes}`)
      }
    }
    console.log('✅ 推送统计测试完成\n')

    // 4. 测试推送历史
    console.log('4. 测试推送历史...')
    const history = await searchEnginePushService.getAllEnginesHistory(3)

    console.log('推送历史:')
    Object.entries(history).forEach(([engine, records]) => {
      console.log(`  ${engine.toUpperCase()}: ${records.length} 条记录`)
      records.slice(0, 2).forEach((record, index) => {
        console.log(`    ${index + 1}. ${record.timestamp} - ${record.success ? '成功' : '失败'} - ${record.urlCount}个URL`)
      })
    })
    console.log('✅ 推送历史测试完成\n')

    // 5. 测试配置验证（如果有配置的话）
    console.log('5. 测试搜索引擎配置验证...')
    try {
      const testResult = await searchEnginePushService.testAllEnginesConfiguration()

      console.log('配置测试结果:')
      console.log(`  总测试数: ${testResult.summary.totalTests}`)
      console.log(`  通过测试: ${testResult.summary.passedTests}`)
      console.log(`  失败测试: ${testResult.summary.failedTests}`)

      if (testResult.baidu) {
        console.log(`  百度测试: ${testResult.baidu.success ? '成功' : '失败'}`)
        if (!testResult.baidu.success) {
          console.log(`    错误: ${testResult.baidu.error}`)
        }
      }

      if (testResult.bing) {
        console.log(`  Bing测试: ${testResult.bing.success ? '成功' : '失败'}`)
        if (!testResult.bing.success) {
          console.log(`    错误: ${testResult.bing.error}`)
        }
      }
    } catch (error) {
      console.log('❌ 配置验证出错:', error.message)
    }
    console.log('✅ 配置验证测试完成\n')

    // 6. 测试Bing配额查询（如果配置了API Key）
    if (bingPushService.apiKey) {
      console.log('6. 测试Bing配额查询...')
      try {
        const quotaResult = await bingPushService.getUrlSubmissionQuota()
        if (quotaResult.success) {
          console.log('✅ Bing配额查询成功')
          console.log('配额信息:', quotaResult.quota)
        } else {
          console.log('❌ Bing配额查询失败:', quotaResult.error)
        }
      } catch (error) {
        console.log('❌ Bing配额查询出错:', error.message)
      }
      console.log()
    }

    // 7. 测试推送新增URL（如果有配置的话）
    const hasAnyConfig = enginesStatus.baidu.configured || enginesStatus.bing.configured
    if (hasAnyConfig) {
      console.log('7. 测试推送新增URL...')
      try {
        const result = await sitemapService.pushToAllSearchEngines({ pushAll: false })

        if (result.success) {
          console.log('✅ 推送新增URL成功')
          console.log(`推送到 ${result.successfulEngines}/${result.totalEngines} 个搜索引擎`)
          if (result.newUrlsCount > 0) {
            console.log(`推送了 ${result.newUrlsCount} 个新增URL`)
          } else {
            console.log('没有新增URL需要推送')
          }

          // 显示各搜索引擎的推送结果
          Object.entries(result.results).forEach(([engine, engineResult]) => {
            console.log(`  ${engine.toUpperCase()}: ${engineResult.success ? '成功' : '失败'} - ${engineResult.message}`)
          })
        } else {
          console.log('❌ 推送新增URL失败:', result.message)
        }
      } catch (error) {
        console.log('❌ 推送新增URL出错:', error.message)
      }
      console.log()
    }

    console.log('🎉 所有测试完成！')

    console.log('\n📋 使用说明:')
    console.log('1. 配置搜索引擎API密钥:')
    console.log('   - 百度: 设置环境变量 BAIDU_TOKEN')
    console.log('   - Bing: 设置环境变量 BING_API_KEY')
    console.log('2. API接口:')
    console.log('   - GET /api/search-engine-push/status - 获取所有搜索引擎状态')
    console.log('   - POST /api/search-engine-push/push-all - 推送所有URL')
    console.log('   - POST /api/search-engine-push/push-new - 推送新增URL')
    console.log('   - GET /api/search-engine-push/history - 获取推送历史')
    console.log('3. 定时推送会自动推送到所有配置的搜索引擎')

  } catch (error) {
    console.error('❌ 测试失败:', error)
    console.error('错误详情:', error.stack)
    process.exit(1)
  }
}

// 运行测试
if (require.main === module) {
  testSearchEnginePushService().then(() => {
    console.log('\n测试完成，正在退出...')
    process.exit(0)
  })
}

module.exports = { testSearchEnginePushService }