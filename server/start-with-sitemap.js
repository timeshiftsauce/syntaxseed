/**
 * 启动服务器并初始化sitemap服务
 */

// 启动主服务器
require('./index.js')

// 延迟启动sitemap服务，确保数据库连接已建立
setTimeout(async () => {
  try {
    const sitemapService = require('./services/sitemapService')

    console.log('\n🗺️  正在初始化Sitemap服务...')

    // 检查当前状态
    const status = await sitemapService.getStatus()
    console.log('当前sitemap状态:', status.exists ? '存在' : '不存在')

    if (status.exists) {
      console.log(`最后生成时间: ${status.lastGenerated}`)
      console.log(`文件大小: ${Math.round(status.size / 1024)} KB`)
    }

    // 启动定期生成任务
    sitemapService.startScheduledGeneration()

    // 如果sitemap不存在或超过1小时未更新，则生成新的
    const shouldGenerate = !status.exists ||
      (Date.now() - new Date(status.lastGenerated).getTime()) > 3600000

    if (shouldGenerate) {
      console.log('正在生成新的sitemap...')
      await sitemapService.saveSitemap()
      console.log('✅ Sitemap生成完成')
    }

    console.log('🎉 Sitemap服务已就绪')
    console.log('📍 访问地址: http://localhost:3000/sitemap.xml')
    console.log('📊 管理接口: http://localhost:3000/api/sitemap/status')

  } catch (error) {
    console.error('❌ Sitemap服务初始化失败:', error.message)
  }
}, 2000) // 延迟2秒启动