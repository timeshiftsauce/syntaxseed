/**
 * 百度推送功能使用示例
 * 演示如何在不同场景下使用百度推送功能
 */

const baiduPushService = require('../services/baiduPushService')
const sitemapService = require('../services/sitemapService')

// 示例1: 推送单个URL
async function pushSingleUrl() {
  console.log('=== 示例1: 推送单个URL ===')

  const url = 'https://syntaxseed.com/blog/new-article'
  const result = await baiduPushService.pushUrls([url])

  console.log('推送结果:', result)
  return result
}

// 示例2: 推送多个URL
async function pushMultipleUrls() {
  console.log('\n=== 示例2: 推送多个URL ===')

  const urls = [
    'https://syntaxseed.com/blog/article-1',
    'https://syntaxseed.com/blog/article-2',
    'https://syntaxseed.com/projects/project-1'
  ]

  const result = await baiduPushService.pushUrls(urls)
  console.log('推送结果:', result)
  return result
}

// 示例3: 推送所有URL
async function pushAllUrls() {
  console.log('\n=== 示例3: 推送所有URL ===')

  const result = await sitemapService.pushToBaidu({ pushAll: true })
  console.log('推送结果:', result)
  return result
}

// 示例4: 推送新增URL
async function pushNewUrls() {
  console.log('\n=== 示例4: 推送新增URL ===')

  const result = await sitemapService.pushToBaidu({ pushAll: false })
  console.log('推送结果:', result)
  return result
}

// 示例5: 批量推送大量URL
async function batchPushUrls() {
  console.log('\n=== 示例5: 批量推送大量URL ===')

  // 模拟大量URL
  const urls = []
  for (let i = 1; i <= 3000; i++) {
    urls.push(`https://syntaxseed.com/blog/article-${i}`)
  }

  const result = await baiduPushService.batchPushUrls(urls)
  console.log('批量推送结果:', result)
  return result
}

// 示例6: 获取推送统计
async function getPushStats() {
  console.log('\n=== 示例6: 获取推送统计 ===')

  const stats = await baiduPushService.getPushStats()
  console.log('推送统计:', stats)
  return stats
}

// 示例7: 获取推送历史
async function getPushHistory() {
  console.log('\n=== 示例7: 获取推送历史 ===')

  const history = await baiduPushService.getPushHistory(10)
  console.log('推送历史 (最近10条):', history)
  return history
}

// 示例8: 测试推送配置
async function testPushConfiguration() {
  console.log('\n=== 示例8: 测试推送配置 ===')

  const result = await baiduPushService.testConfiguration()
  console.log('配置测试结果:', result)
  return result
}

// 示例9: 在内容发布时自动推送
async function simulateContentPublish() {
  console.log('\n=== 示例9: 模拟内容发布自动推送 ===')

  // 模拟发布新博客文章
  const newBlogId = '4955173124191556001'
  const blogUrl = `https://syntaxseed.com/blog/${newBlogId}`

  console.log(`模拟发布新博客文章: ${blogUrl}`)

  // 立即推送新文章URL
  const result = await baiduPushService.pushUrls([blogUrl])
  console.log('自动推送结果:', result)

  return result
}

// 示例10: 错误处理
async function handlePushErrors() {
  console.log('\n=== 示例10: 错误处理示例 ===')

  try {
    // 尝试推送无效URL
    const invalidUrls = [
      'invalid-url',
      'http://other-site.com/page'
    ]

    const result = await baiduPushService.pushUrls(invalidUrls)

    if (!result.success) {
      console.log('推送失败，错误信息:', result.error)

      // 处理不同类型的错误
      if (result.statusCode === 400) {
        console.log('客户端错误，检查URL格式或配置')
      } else if (result.statusCode === 401) {
        console.log('认证失败，检查Token配置')
      } else if (result.statusCode === 500) {
        console.log('服务器错误，稍后重试')
      }
    }

    return result
  } catch (error) {
    console.error('推送过程中发生异常:', error.message)
    return { success: false, error: error.message }
  }
}

// 主函数：运行所有示例
async function runAllExamples() {
  console.log('🚀 百度推送功能使用示例\n')

  try {
    // 检查配置
    if (!baiduPushService.token) {
      console.log('⚠️  警告: 百度推送Token未配置')
      console.log('请设置环境变量 BAIDU_TOKEN 后再运行示例')
      console.log('部分示例将跳过实际推送操作\n')
    }

    // 运行示例（根据是否有Token决定是否执行实际推送）
    await getPushStats()
    await getPushHistory()

    if (baiduPushService.token) {
      await testPushConfiguration()
      await pushSingleUrl()
      await pushMultipleUrls()
      await pushNewUrls()
      await simulateContentPublish()
      await handlePushErrors()

      // 注意：批量推送会消耗大量配额，谨慎使用
      // await batchPushUrls()
      // await pushAllUrls()
    } else {
      console.log('跳过需要Token的推送示例')
    }

    console.log('\n🎉 所有示例运行完成！')

  } catch (error) {
    console.error('❌ 示例运行失败:', error)
  }
}

// 如果直接运行此文件，执行所有示例
if (require.main === module) {
  runAllExamples().then(() => {
    console.log('\n示例运行完成，正在退出...')
    process.exit(0)
  })
}

module.exports = {
  pushSingleUrl,
  pushMultipleUrls,
  pushAllUrls,
  pushNewUrls,
  batchPushUrls,
  getPushStats,
  getPushHistory,
  testPushConfiguration,
  simulateContentPublish,
  handlePushErrors,
  runAllExamples
}