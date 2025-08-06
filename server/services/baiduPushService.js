const axios = require('axios')
const fs = require('fs').promises

class BaiduPushService {
  constructor() {
    // 从环境变量获取配置
    this.site = process.env.BAIDU_SITE || 'https://shiqianjiang.cn'
    this.token = process.env.BAIDU_TOKEN || '4Ev6h0FfsTdlZhtq'
    this.apiUrl = 'http://data.zz.baidu.com/urls'
    this.maxUrlsPerRequest = 2000 // 百度限制每次最多2000条
    this.pushLogPath = require('path').join(__dirname, '../logs/baidu-push.log')
  }

  /**
   * 推送URL到百度搜索引擎
   * @param {Array} urls - 要推送的URL数组
   * @returns {Object} 推送结果
   */
  async pushUrls(urls) {
    if (!this.token) {
      throw new Error('百度推送Token未配置，请设置环境变量 BAIDU_TOKEN')
    }

    if (!urls || urls.length === 0) {
      return { success: false, message: '没有URL需要推送' }
    }

    // 限制每次推送的URL数量
    const urlsToSubmit = urls.slice(0, this.maxUrlsPerRequest)

    try {
      console.log(`开始推送 ${urlsToSubmit.length} 个URL到百度搜索引擎...`)

      const response = await axios.post(
        `${this.apiUrl}?site=${this.site}&token=${this.token}`,
        urlsToSubmit.join('\n'),
        {
          headers: {
            'Content-Type': 'text/plain',
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

      console.log('百度推送成功:', {
        成功推送: response.data.success || 0,
        剩余配额: response.data.remain || 0,
        无效URL: response.data.not_valid?.length || 0,
        非本站URL: response.data.not_same_site?.length || 0
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

      console.error('百度推送失败:', errorResult.error)
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
      console.log('没有新增URL需要推送')
      return { success: true, message: '没有新增URL需要推送', newUrlsCount: 0 }
    }

    console.log(`发现 ${newUrls.length} 个新增URL`)
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

    console.log(`开始批量推送，共 ${urls.length} 个URL，分 ${batches} 批处理`)

    for (let i = 0; i < batches; i++) {
      const start = i * this.maxUrlsPerRequest
      const end = start + this.maxUrlsPerRequest
      const batchUrls = urls.slice(start, end)

      console.log(`推送第 ${i + 1}/${batches} 批，包含 ${batchUrls.length} 个URL`)

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
      console.error('写入推送日志失败:', error)
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
      console.error('获取推送统计失败:', error)
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
   * 测试百度推送配置
   * @returns {Object} 测试结果
   */
  async testConfiguration() {
    const testUrl = `${this.baseUrl || 'https://shiqianjiang.cn'}/`

    try {
      const result = await this.pushUrls([testUrl])
      return {
        success: true,
        message: '百度推送配置测试成功',
        testUrl,
        result
      }
    } catch (error) {
      return {
        success: false,
        message: '百度推送配置测试失败',
        error: error.message,
        testUrl
      }
    }
  }
}

// 创建单例实例
const baiduPushService = new BaiduPushService()

module.exports = baiduPushService