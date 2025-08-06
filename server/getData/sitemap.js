const express = require('express')
const router = express.Router()
const sitemapService = require('../services/sitemapService')
const { autoPushAfterSitemapUpdate } = require('../middleware/baiduPushMiddleware')

/**
 * 获取sitemap状态
 */
router.get('/status', async (req, res) => {
  try {
    const status = await sitemapService.getStatus()
    res.json({
      success: true,
      data: status
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
router.post('/generate', autoPushAfterSitemapUpdate(), async (req, res) => {
  try {
    const result = await sitemapService.generateNow()

    if (result.success) {
      res.json({
        success: true,
        message: result.message
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
 * 获取sitemap.xml文件内容
 */
router.get('/xml', async (req, res) => {
  try {
    const xml = await sitemapService.generateSitemapXML()
    res.set('Content-Type', 'application/xml')
    res.send(xml)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取sitemap XML失败',
      error: error.message
    })
  }
})

module.exports = router