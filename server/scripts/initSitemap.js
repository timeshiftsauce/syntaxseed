const sitemapService = require('../services/sitemapService')

/**
 * 初始化sitemap - 在服务器首次启动时生成sitemap
 */
async function initSitemap() {
  try {
    console.log('正在初始化sitemap...')

    // 检查sitemap是否已存在
    const status = await sitemapService.getStatus()

    if (!status.exists) {
      console.log('Sitemap不存在，正在生成...')
      await sitemapService.saveSitemap()
      console.log('初始sitemap生成完成')
    } else {
      console.log(`Sitemap已存在，最后更新时间: ${status.lastGenerated}`)

      // 如果sitemap超过24小时未更新，重新生成
      const lastGenerated = new Date(status.lastGenerated)
      const now = new Date()
      const hoursDiff = (now - lastGenerated) / (1000 * 60 * 60)

      if (hoursDiff > 24) {
        console.log('Sitemap已过期，正在重新生成...')
        await sitemapService.saveSitemap()
        console.log('Sitemap更新完成')
      }
    }
  } catch (error) {
    console.error('初始化sitemap失败:', error)
  }
}

module.exports = { initSitemap }