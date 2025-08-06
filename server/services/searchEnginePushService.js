const baiduPushService = require('./baiduPushService')
const bingPushService = require('./bingPushService')

class SearchEnginePushService {
  constructor() {
    this.enableBaidu = process.env.ENABLE_BAIDU_PUSH !== 'false'
    this.enableBing = process.env.ENABLE_BING_PUSH !== 'false'
  }

  /**
   * 推送URL到所有启用的搜索引擎
   * @param {Array} urls - 要推送的URL数组
   * @returns {Object} 推送结果汇总
   */
  async pushToAllEngines(urls) {
    if (!urls || urls.length === 0) {
      return { success: false, message: '没有URL需要推送' }
    }

    const results = {}
    const promises = []

    // 推送到百度
    if (this.enableBaidu && baiduPushService.token) {
      promises.push(
        baiduPushService.pushUrls(urls)
          .then(result => ({ engine: 'baidu', ...result }))
          .catch(error => ({ engine: 'baidu', success: false, error: error.message }))
      )
    }

    // 推送到Bing
    if (this.enableBing && bingPushService.apiKey) {
      promises.push(
        bingPushService.pushUrls(urls)
          .then(result => ({ engine: 'bing', ...result }))
          .catch(error => ({ engine: 'bing', success: false, error: error.message }))
      )
    }

    if (promises.length === 0) {
      return {
        success: false,
        message: '没有启用的搜索引擎或缺少配置',
        results: {}
      }
    }

    // 并行推送到所有搜索引擎
    const engineResults = await Promise.all(promises)

    // 整理结果
    engineResults.forEach(result => {
      results[result.engine] = {
        success: result.success,
        message: result.success ? '推送成功' : '推送失败',
        data: result.data || result.error,
        submittedCount: result.submittedCount || 0
      }
    })

    const overallSuccess = engineResults.every(r => r.success)
    const successCount = engineResults.filter(r => r.success).length

    return {
      success: overallSuccess,
      message: overallSuccess ?
        `成功推送到所有 ${successCount} 个搜索引擎` :
        `部分推送失败，成功 ${successCount}/${engineResults.length} 个搜索引擎`,
      results,
      totalEngines: engineResults.length,
      successfulEngines: successCount,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * 推送新增URL到所有搜索引擎
   * @param {Array} allUrls - 所有URL
   * @param {Array} lastPushedUrls - 上次推送的URL
   * @returns {Object} 推送结果
   */
  async pushNewUrlsToAllEngines(allUrls, lastPushedUrls = []) {
    const newUrls = allUrls.filter(url => !lastPushedUrls.includes(url))

    if (newUrls.length === 0) {
      return {
        success: true,
        message: '没有新增URL需要推送',
        newUrlsCount: 0,
        results: {}
      }
    }

    console.log(`发现 ${newUrls.length} 个新增URL，开始推送到所有搜索引擎`)

    const result = await this.pushToAllEngines(newUrls)
    result.newUrlsCount = newUrls.length
    result.newUrls = newUrls

    return result
  }

  /**
   * 获取所有搜索引擎的推送统计
   * @returns {Object} 统计信息汇总
   */
  async getAllEnginesStats() {
    const stats = {
      baidu: null,
      bing: null,
      summary: {
        totalEngines: 0,
        enabledEngines: 0,
        configuredEngines: 0
      }
    }

    // 获取百度统计
    if (this.enableBaidu) {
      stats.summary.enabledEngines++
      if (baiduPushService.token) {
        stats.summary.configuredEngines++
        try {
          stats.baidu = await baiduPushService.getPushStats()
        } catch (error) {
          stats.baidu = { error: error.message }
        }
      } else {
        stats.baidu = { error: 'Token未配置' }
      }
    }

    // 获取Bing统计
    if (this.enableBing) {
      stats.summary.enabledEngines++
      if (bingPushService.apiKey) {
        stats.summary.configuredEngines++
        try {
          stats.bing = await bingPushService.getPushStats()
        } catch (error) {
          stats.bing = { error: error.message }
        }
      } else {
        stats.bing = { error: 'API Key未配置' }
      }
    }

    stats.summary.totalEngines = 2 // 百度 + Bing

    return stats
  }

  /**
   * 获取所有搜索引擎的推送历史
   * @param {number} limit - 每个引擎返回的记录数量
   * @returns {Object} 历史记录汇总
   */
  async getAllEnginesHistory(limit = 20) {
    const history = {
      baidu: [],
      bing: []
    }

    // 获取百度历史
    if (this.enableBaidu && baiduPushService.token) {
      try {
        history.baidu = await baiduPushService.getPushHistory(limit)
      } catch (error) {
        console.error('获取百度推送历史失败:', error)
      }
    }

    // 获取Bing历史
    if (this.enableBing && bingPushService.apiKey) {
      try {
        history.bing = await bingPushService.getPushHistory(limit)
      } catch (error) {
        console.error('获取Bing推送历史失败:', error)
      }
    }

    return history
  }

  /**
   * 测试所有搜索引擎的配置
   * @returns {Object} 测试结果汇总
   */
  async testAllEnginesConfiguration() {
    const results = {
      baidu: null,
      bing: null,
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0
      }
    }

    // 测试百度配置
    if (this.enableBaidu) {
      results.summary.totalTests++
      if (baiduPushService.token) {
        try {
          results.baidu = await baiduPushService.testConfiguration()
          if (results.baidu.success) {
            results.summary.passedTests++
          } else {
            results.summary.failedTests++
          }
        } catch (error) {
          results.baidu = { success: false, error: error.message }
          results.summary.failedTests++
        }
      } else {
        results.baidu = { success: false, error: 'Token未配置' }
        results.summary.failedTests++
      }
    }

    // 测试Bing配置
    if (this.enableBing) {
      results.summary.totalTests++
      if (bingPushService.apiKey) {
        try {
          results.bing = await bingPushService.testConfiguration()
          if (results.bing.success) {
            results.summary.passedTests++
          } else {
            results.summary.failedTests++
          }
        } catch (error) {
          results.bing = { success: false, error: error.message }
          results.summary.failedTests++
        }
      } else {
        results.bing = { success: false, error: 'API Key未配置' }
        results.summary.failedTests++
      }
    }

    return results
  }

  /**
   * 获取搜索引擎配置状态
   * @returns {Object} 配置状态
   */
  getEnginesStatus() {
    return {
      baidu: {
        enabled: this.enableBaidu,
        configured: !!baiduPushService.token,
        site: baiduPushService.site,
        maxUrlsPerRequest: baiduPushService.maxUrlsPerRequest
      },
      bing: {
        enabled: this.enableBing,
        configured: !!bingPushService.apiKey,
        siteUrl: bingPushService.siteUrl,
        maxUrlsPerRequest: bingPushService.maxUrlsPerRequest
      }
    }
  }
}

// 创建单例实例
const searchEnginePushService = new SearchEnginePushService()

module.exports = searchEnginePushService