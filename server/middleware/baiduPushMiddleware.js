/**
 * 百度推送中间件
 * 用于在内容发布时自动推送URL到百度搜索引擎
 */

const sitemapService = require('../services/sitemapService')

/**
 * 内容发布后自动推送中间件
 * 在博客文章或项目发布后自动推送相关URL
 */
const autoPushAfterPublish = (contentType) => {
  return async (req, res, next) => {
    // 保存原始的 res.json 方法
    const originalJson = res.json

    // 重写 res.json 方法
    res.json = async function (data) {
      // 先调用原始方法发送响应
      originalJson.call(this, data)

      // 如果操作成功，尝试推送URL
      if (data.success || data.code === 200) {
        try {
          let urlToPush = null

          // 根据内容类型构建URL
          if (contentType === 'blog' && (req.method === 'POST' || req.method === 'PUT')) {
            const blogId = data.data?.id || req.params.id
            if (blogId) {
              urlToPush = `${process.env.BASE_URL || 'https://syntaxseed.com'}/blog/${blogId}`
            }
          } else if (contentType === 'project' && (req.method === 'POST' || req.method === 'PUT')) {
            const projectId = data.data?.id || req.params.id
            if (projectId) {
              urlToPush = `${process.env.BASE_URL || 'https://syntaxseed.com'}/projects/${projectId}`
            }
          }

          // 推送URL到百度搜索引擎
          if (urlToPush) {
            console.log(`内容发布成功，准备推送URL到百度搜索引擎: ${urlToPush}`)

            // 异步推送，不阻塞响应
            setImmediate(async () => {
              try {
                const baiduPushService = require('../services/baiduPushService')
                const result = await baiduPushService.pushUrls([urlToPush])

                if (result.success) {
                  console.log(`URL推送成功: ${urlToPush}`)
                } else {
                  console.error(`URL推送失败: ${urlToPush}`, result.error)
                }
              } catch (error) {
                console.error(`URL推送出错: ${urlToPush}`, error.message)
              }
            })
          }
        } catch (error) {
          console.error('自动推送URL时出错:', error.message)
        }
      }
    }

    next()
  }
}

/**
 * 批量推送中间件
 * 在批量操作后推送多个URL
 */
const batchPushAfterOperation = () => {
  return async (req, res, next) => {
    // 在请求对象上添加推送队列
    req.pushQueue = req.pushQueue || []

    // 添加推送URL的方法
    req.addToPushQueue = (url) => {
      if (url && !req.pushQueue.includes(url)) {
        req.pushQueue.push(url)
      }
    }

    // 保存原始的 res.json 方法
    const originalJson = res.json

    // 重写 res.json 方法
    res.json = async function (data) {
      // 先调用原始方法发送响应
      originalJson.call(this, data)

      // 如果有待推送的URL且操作成功
      if ((data.success || data.code === 200) && req.pushQueue.length > 0) {
        console.log(`批量操作成功，准备推送 ${req.pushQueue.length} 个URL到百度搜索引擎`)

        // 异步推送，不阻塞响应
        setImmediate(async () => {
          try {
            const baiduPushService = require('../services/baiduPushService')
            const result = await baiduPushService.pushUrls(req.pushQueue)

            if (result.success) {
              console.log(`批量URL推送成功，推送了 ${req.pushQueue.length} 个URL`)
            } else {
              console.error(`批量URL推送失败`, result.error)
            }
          } catch (error) {
            console.error('批量推送URL时出错:', error.message)
          }
        })
      }
    }

    next()
  }
}

/**
 * sitemap更新后自动推送中间件
 * 在sitemap更新后自动推送新增URL
 */
const autoPushAfterSitemapUpdate = () => {
  return async (req, res, next) => {
    // 保存原始的 res.json 方法
    const originalJson = res.json

    // 重写 res.json 方法
    res.json = async function (data) {
      // 先调用原始方法发送响应
      originalJson.call(this, data)

      // 如果sitemap生成成功
      if (data.success || data.code === 200) {
        console.log('Sitemap更新成功，准备推送新增URL到百度搜索引擎')

        // 异步推送，不阻塞响应
        setImmediate(async () => {
          try {
            const result = await sitemapService.pushToBaidu({ pushAll: false })

            if (result.success) {
              if (result.newUrlsCount > 0) {
                console.log(`自动推送成功，推送了 ${result.newUrlsCount} 个新增URL`)
              } else {
                console.log('没有新增URL需要推送')
              }
            } else {
              console.error('自动推送失败:', result.message)
            }
          } catch (error) {
            console.error('自动推送URL时出错:', error.message)
          }
        })
      }
    }

    next()
  }
}

module.exports = {
  autoPushAfterPublish,
  batchPushAfterOperation,
  autoPushAfterSitemapUpdate
}