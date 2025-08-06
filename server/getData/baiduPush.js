const express = require('express')
const router = express.Router()
const baiduPushService = require('../services/baiduPushService')
const sitemapService = require('../services/sitemapService')

/**
 * 获取百度推送状态和统计信息
 */
router.get('/status', async (req, res) => {
  try {
    const stats = await baiduPushService.getPushStats()
    const history = await baiduPushService.getPushHistory(10) // 获取最近10条记录

    res.json({
      success: true,
      data: {
        stats,
        recentHistory: history,
        configuration: {
          site: baiduPushService.site,
          tokenConfigured: !!baiduPushService.token,
          maxUrlsPerRequest: baiduPushService.maxUrlsPerRequest
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取百度推送状态失败',
      error: error.message
    })
  }
})

/**
 * 手动推送所有URL到百度搜索引擎
 */
router.post('/push-all', async (req, res) => {
  try {
    const result = await sitemapService.pushToBaidu({ pushAll: true })

    if (result.success) {
      res.json({
        success: true,
        message: '推送完成',
        data: result
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.message || '推送失败',
        data: result
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '推送失败',
      error: error.message
    })
  }
})

/**
 * 推送新增URL到百度搜索引擎
 */
router.post('/push-new', async (req, res) => {
  try {
    const result = await sitemapService.pushToBaidu({ pushAll: false })

    if (result.success) {
      res.json({
        success: true,
        message: result.newUrlsCount > 0 ?
          `成功推送 ${result.newUrlsCount} 个新增URL` :
          '没有新增URL需要推送',
        data: result
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.message || '推送失败',
        data: result
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '推送失败',
      error: error.message
    })
  }
})

/**
 * 推送指定的URL列表
 */
router.post('/push-urls', async (req, res) => {
  try {
    const { urls } = req.body

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的URL数组'
      })
    }

    if (urls.length > 2000) {
      return res.status(400).json({
        success: false,
        message: '每次最多只能推送2000个URL'
      })
    }

    const result = await baiduPushService.pushUrls(urls)

    if (result.success) {
      res.json({
        success: true,
        message: '推送完成',
        data: result
      })
    } else {
      res.status(400).json({
        success: false,
        message: '推送失败',
        data: result
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '推送失败',
      error: error.message
    })
  }
})

/**
 * 获取推送历史记录
 */
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50
    const history = await baiduPushService.getPushHistory(limit)

    res.json({
      success: true,
      data: history,
      total: history.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取推送历史失败',
      error: error.message
    })
  }
})

/**
 * 测试百度推送配置
 */
router.post('/test', async (req, res) => {
  try {
    const result = await baiduPushService.testConfiguration()

    if (result.success) {
      res.json({
        success: true,
        message: '配置测试成功',
        data: result
      })
    } else {
      res.status(400).json({
        success: false,
        message: '配置测试失败',
        data: result
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '配置测试失败',
      error: error.message
    })
  }
})

/**
 * 获取当前网站的所有URL
 */
router.get('/urls', async (req, res) => {
  try {
    const urls = await sitemapService.getAllUrls()
    const lastPushedUrls = await sitemapService.getLastPushedUrls()

    // 标记哪些URL是新增的
    const urlsWithStatus = urls.map(url => ({
      url,
      isNew: !lastPushedUrls.includes(url)
    }))

    const newUrls = urlsWithStatus.filter(item => item.isNew)

    res.json({
      success: true,
      data: {
        allUrls: urlsWithStatus,
        totalCount: urls.length,
        newCount: newUrls.length,
        pushedCount: urls.length - newUrls.length
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取URL列表失败',
      error: error.message
    })
  }
})

module.exports = router