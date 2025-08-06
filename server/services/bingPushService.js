const axios = require('axios')
const fs = require('fs').promises

class BingPushService {
  constructor() {
    // 从环境变量获取配置
    this.siteUrl = process.env.BING_SITE_URL || 'https://syntaxseed.com'
    this.apiKey = process.env.BING_API_KEY || ''
    this.apiBaseUrl = 'https://ssl.bing.com/webmaster/api.svc'
    this.maxUrlsPerRequest = 500 // Bing限制每次最多500条
    this.pushLogPath = require('path').join(__dirname, '../logs/bing-push.log')
  }

  /**
   * 推送URL到Bing搜索引擎
   * @param {Array} urls - 要推送的URL数组
   * @returns {Object} 推送结果
   */
  async pushUrls(urls) {
    if (!this.apiKey) {
      throw new Error('Bing推送API Key未配置，请设置环境变量 BING_API_KEY')
    }

    if (!urls || urls.length === 0) {
      return { success: false, message: '没有URL需要推送' }
    }

    // 限制每次推送的URL数量
    const urlsToSubmit = urls.slice(0, this.maxUrlsPerRequest)

    try {
      console.log(`开始推送 ${urlsToSubmit.length} 个URL到Bing搜索引擎...`)

      // 使用JSON格式推送
      const response = await axios.post(
        `${this.apiBaseUrl}/json/SubmitUrlBatch?apikey=${this.apiKey}`,
        {
          siteUrl: this.siteUrl,
          urlList: urlsToSubmit
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'User-Agent': 'SyntaxSeed-Blog/1.0'
          },
          timeout: 30000 // 30秒超时
        }
      )

      const result = {
        success: true,
        statusCode: response.status,
        data: response.data,
        submittedCount: urlsToSubmit.length,
        timestamp: new Date().toISOString()
      }

      // 记录推送日志
      await this.logPushResult(result, urlsToSubmit)

      console.log('Bing推送成功:', {
        状态码: response.status,
        推送数量: urlsToSubmit.length,
        响应数据: response.data
      })

      return result

    } catch (error) {
      const errorResult = {
        success: false,
        error: error.response?.data || error.message,
        statusCode: error.response?.status || 500,
        submittedCount: urlsToSubmit.length,
        timestamp: new Date().toISOString()
      }

      // 记录错误日志
      await this.logPushResult(errorResult, urlsToSubmit)

      console.error('Bing推送失败:', errorResult.error)
      return errorResult
    }
  }

  /**
   * 推送新增的URL（避免重复推送）
   * @param {Array} allUrls - 所有URL
   * @param {Array} lastPushedUrls - 上次推送的URL
   * @returns {Object} 推送结果
   */
  async pushNewUrls(allUrls, lastPushedUrls = []) {
    // 找出新增的URL
    const newUrls = allUrls.filter(url => !lastPushedUrls.includes(url))

    if (newUrls.length === 0) {
      console.log('没有新增URL需要推送到Bing')
      return { success: true, message: '没有新增URL需要推送到Bing', newUrlsCount: 0 }
    }

    console.log(`发现 ${newUrls.length} 个新增URL需要推送到Bing`)
    const result = await this.pushUrls(newUrls)

    if (result.success) {
      result.newUrlsCount = newUrls.length
      result.newUrls = newUrls
    }

    return result
  }

  /**
   * 批量推送URL（自动分批处理）
   * @param {Array} urls - 要推送的URL数组
   * @returns {Object} 推送结果汇总
   */
  async batchPushUrls(urls) {
    if (!urls || urls.length === 0) {
      return { success: false, message: '没有URL需要推送' }
    }

    const results = []
    const batches = Math.ceil(urls.length / this.maxUrlsPerRequest)

    console.log(`开始批量推送到Bing，共 ${urls.length} 个URL，分 ${batches} 批处理`)

    for (let i = 0; i < batches; i++) {
      const start = i * this.maxUrlsPerRequest
      const end = start + this.maxUrlsPerRequest
      const batchUrls = urls.slice(start, end)

      console.log(`推送第 ${i + 1}/${batches} 批到Bing，包含 ${batchUrls.length} 个URL`)

      const result = await this.pushUrls(batchUrls)
      results.push(result)

      // 如果不是最后一批，等待1秒避免请求过于频繁
      if (i < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // 汇总结果
    const summary = {
      success: results.every(r => r.success),
      totalBatches: batches,
      totalUrls: urls.length,
      successfulBatches: results.filter(r => r.success).length,
      failedBatches: results.filter(r => !r.success).length,
      results: results,
      timestamp: new Date().toISOString()
    }

    return summary
  }

  /**
   * 获取URL提交配额（Bing API功能，需要实现）
   * @returns {Object} 配额信息
   */
  async getUrlSubmissionQuota() {
    if (!this.apiKey) {
      throw new Error('Bing推送API Key未配置')
    }

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/json/GetUrlSubmissionQuota?apikey=${this.apiKey}`,
        {
          siteUrl: this.siteUrl
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          timeout: 10000
        }
      )

      return {
        success: true,
        quota: response.data,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('获取Bing配额失败:', error.message)
      return {
        success: false,
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * 记录推送日志
   * @param {Object} result - 推送结果
   * @param {Array} urls - 推送的URL
   */
  async logPushResult(result, urls) {
    try {
      const logEntry = {
        timestamp: result.timestamp,
        success: result.success,
        urlCount: urls.length,
        statusCode: result.statusCode,
        data: result.data || result.error,
        urls: urls.slice(0, 10) // 只记录前10个URL，避免日志过大
      }

      const logLine = JSON.stringify(logEntry) + '\n'

      // 确保日志目录存在
      const logDir = require('path').dirname(this.pushLogPath)
      await fs.mkdir(logDir, { recursive: true })

      // 追加日志
      await fs.appendFile(this.pushLogPath, logLine, 'utf8')
    } catch (error) {
      console.error('写入Bing推送日志失败:', error)
    }
  }

  /**
   * 获取推送历史记录
   * @param {number} limit - 返回记录数量限制
   * @returns {Array} 推送历史
   */
  async getPushHistory(limit = 50) {
    try {
      const logContent = await fs.readFile(this.pushLogPath, 'utf8')
      const lines = logContent.trim().split('\n').filter(line => line)

      const history = lines
        .slice(-limit) // 获取最近的记录
        .map(line => {
          try {
            return JSON.parse(line)
          } catch (error) {
            return null
          }
        })
        .filter(entry => entry !== null)
        .reverse() // 最新的在前面

      return history
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [] // 文件不存在，返回空数组
      }
      throw error
    }
  }

  /**
   * 获取推送统计信息
   * @returns {Object} 统计信息
   */
  async getPushStats() {
    try {
      const history = await this.getPushHistory(1000) // 获取最近1000条记录

      const today = new Date().toISOString().split('T')[0]
      const todayRecords = history.filter(record =>
        record.timestamp.startsWith(today)
      )

      const stats = {
        totalPushes: history.length,
        todayPushes: todayRecords.length,
        successfulPushes: history.filter(r => r.success).length,
        failedPushes: history.filter(r => !r.success).length,
        totalUrlsPushed: history.reduce((sum, r) => sum + (r.urlCount || 0), 0),
        todayUrlsPushed: todayRecords.reduce((sum, r) => sum + (r.urlCount || 0), 0),
        lastPushTime: history.length > 0 ? history[0].timestamp : null,
        successRate: history.length > 0 ?
          Math.round((history.filter(r => r.success).length / history.length) * 100) : 0
      }

      return stats
    } catch (error) {
      console.error('获取Bing推送统计失败:', error)
      return {
        totalPushes: 0,
        todayPushes: 0,
        successfulPushes: 0,
        failedPushes: 0,
        totalUrlsPushed: 0,
        todayUrlsPushed: 0,
        lastPushTime: null,
        successRate: 0
      }
    }
  }

  /**
   * 测试Bing推送配置
   * @returns {Object} 测试结果
   */
  async testConfiguration() {
    try {
      // 首先测试获取配额
      const quotaResult = await this.getUrlSubmissionQuota()

      if (quotaResult.success) {
        return {
          success: true,
          message: 'Bing推送配置测试成功',
          quota: quotaResult.quota,
          siteUrl: this.siteUrl
        }
      } else {
        return {
          success: false,
          message: 'Bing推送配置测试失败',
          error: quotaResult.error,
          siteUrl: this.siteUrl
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Bing推送配置测试失败',
        error: error.message,
        siteUrl: this.siteUrl
      }
    }
  }
}

// 创建单例实例
const bingPushService = new BingPushService()

module.exports = bingPushService