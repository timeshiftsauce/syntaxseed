const express = require('express')
const router = express.Router()
const searchEnginePushService = require('../services/searchEnginePushService')
const bingPushService = require('../services/bingPushService')
const sitemapService = require('../services/sitemapService')

/**
 * 获取所有搜索引擎推送状态
 */
router.get('/status', async (req, res) => {
  try {
    const stats = await searchEnginePushService.getAllEnginesStats()
    const enginesStatus = searchEnginePushService.getEnginesStatus()
    const history = await searchEnginePushService.getAllEnginesHistory(5)

    res.json({
      success: true,
      data: {
        stats,
        enginesStatus,
        recentHistory: history
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取搜索引擎推送状态失败',
      error: error.message
    })
  }
})

/**
 * 推送所有URL到所有搜索引擎
 */
router.post('/push-all', async (req, res) => {
  try {
    const result = await sitemapService.pushToAllSearchEngines({ pushAll: true })

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: result
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
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
 * 推送新增URL到所有搜索引擎
 */
router.post('/push-new', async (req, res) => {
  try {
    const result = await sitemapService.pushToAllSearchEngines({ pushAll: false })

    if (result.success) {
      res.json({
        success: true,
        message: result.newUrlsCount > 0 ?
          `成功推送 ${result.newUrlsCount} 个新增URL到 ${result.successfulEngines} 个搜索引擎` :
          '没有新增URL需要推送',
        data: result
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
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
 * 推送指定URL到所有搜索引擎
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

    if (urls.length > 500) {
      return res.status(400).json({
        success: false,
        message: '每次最多只能推送500个URL'
      })
    }

    const result = await searchEnginePushService.pushToAllEngines(urls)

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: result
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
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
 * 获取所有搜索引擎推送历史
 */
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    const history = await searchEnginePushService.getAllEnginesHistory(limit)

    res.json({
      success: true,
      data: history
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
 * 测试所有搜索引擎配置
 */
router.post('/test', async (req, res) => {
  try {
    const result = await searchEnginePushService.testAllEnginesConfiguration()

    const overallSuccess = result.summary.passedTests === result.summary.totalTests

    if (overallSuccess) {
      res.json({
        success: true,
        message: '所有搜索引擎配置测试成功',
        data: result
      })
    } else {
      res.status(400).json({
        success: false,
        message: `配置测试部分失败，通过 ${result.summary.passedTests}/${result.summary.totalTests} 个测试`,
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
 * 获取Bing推送配额
 */
router.get('/bing/quota', async (req, res) => {
  try {
    const result = await bingPushService.getUrlSubmissionQuota()

    if (result.success) {
      res.json({
        success: true,
        message: '获取Bing配额成功',
        data: result.quota
      })
    } else {
      res.status(400).json({
        success: false,
        message: '获取Bing配额失败',
        error: result.error
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取Bing配额失败',
      error: error.message
    })
  }
})

/**
 * 获取搜索引擎配置状态
 */
router.get('/engines', async (req, res) => {
  try {
    const enginesStatus = searchEnginePushService.getEnginesStatus()

    res.json({
      success: true,
      data: {
        engines: enginesStatus,
        summary: {
          totalEngines: Object.keys(enginesStatus).length,
          enabledEngines: Object.values(enginesStatus).filter(e => e.enabled).length,
          configuredEngines: Object.values(enginesStatus).filter(e => e.configured).length
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取搜索引擎状态失败',
      error: error.message
    })
  }
})

module.exports = router