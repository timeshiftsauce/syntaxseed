const express = require('express')
const router = express.Router()
const sitemapService = require('../../services/sitemapService')

/**
 * 管理员sitemap管理接口
 * 需要管理员权限验证中间件
 */

/**
 * 获取sitemap详细状态
 */
router.get('/status', async (req, res) => {
  try {
    const status = await sitemapService.getStatus()

    // 获取URL统计信息
    let urlStats = null
    if (status.exists) {
      try {
        const xml = await sitemapService.generateSitemapXML()
        const urlCount = (xml.match(/<url>/g) || []).length
        urlStats = {
          totalUrls: urlCount,
          estimatedSize: `${Math.round(xml.length / 1024)} KB`
        }
      } catch (error) {
        console.error('获取URL统计失败:', error)
      }
    }

    res.json({
      success: true,
      data: {
        ...status,
        urlStats,
        nextScheduledGeneration: '每天凌晨2点'
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取sitemap状态失败',
      error: error.message
    })
  }
})

/**
 * 手动生成sitemap
 */
router.post('/generate', async (req, res) => {
  try {
    const result = await sitemapService.generateNow()

    if (result.success) {
      // 获取生成后的状态
      const status = await sitemapService.getStatus()

      res.json({
        success: true,
        message: result.message,
        data: status
      })
    } else {
      res.status(500).json({
        success: false,
        message: result.message
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '生成sitemap失败',
      error: error.message
    })
  }
})

/**
 * 预览sitemap内容（返回前100行）
 */
router.get('/preview', async (req, res) => {
  try {
    const xml = await sitemapService.generateSitemapXML()
    const lines = xml.split('\n')
    const preview = lines.slice(0, 100).join('\n')
    const totalLines = lines.length

    res.json({
      success: true,
      data: {
        preview,
        totalLines,
        isComplete: totalLines <= 100
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '预览sitemap失败',
      error: error.message
    })
  }
})

/**
 * 获取sitemap配置信息
 */
router.get('/config', (req, res) => {
  try {
    const config = {
      baseUrl: process.env.BASE_URL || 'https://syntaxseed.com',
      scheduledTime: '每天凌晨2点 (Asia/Shanghai)',
      staticPages: [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/about', priority: '0.8', changefreq: 'monthly' },
        { url: '/projects', priority: '0.9', changefreq: 'weekly' },
        { url: '/blog', priority: '0.9', changefreq: 'daily' },
        { url: '/timeline', priority: '0.7', changefreq: 'monthly' }
      ],
      dynamicContent: [
        { type: 'blog_posts', priority: '0.8', changefreq: 'monthly' },
        { type: 'projects', priority: '0.7', changefreq: 'monthly' },
        { type: 'categories', priority: '0.6', changefreq: 'weekly' }
      ]
    }

    res.json({
      success: true,
      data: config
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取sitemap配置失败',
      error: error.message
    })
  }
})

module.exports = router