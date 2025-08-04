/**
 * 请求限流中间件
 * 用于控制API请求频率，防止过度使用
 */

const rateLimit = require('express-rate-limit')
const { AppError } = require('./errorHandler')

// 创建自定义错误格式的处理函数
const createCustomHandler = (message) => {
  return (_req, _res, next) => {
    _res.status(429).json({
      success: false,
      code: 429,
      message: message || '请求过于频繁，请稍后再试',
    })
    const error = new AppError(message || '请求过于频繁，请稍后再试', 429)
    next(error)
  }
}

// 全局通用限流器
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟窗口期
  limit: 120, // 每个IP每分钟最多120个请求
  standardHeaders: 'draft-7', // 返回标准的RateLimit头信息
  legacyHeaders: false, // 禁用X-RateLimit-*头
  handler: createCustomHandler('请求过于频繁，请稍后再试'),
  skipSuccessfulRequests: false, // 成功的请求也计入限制
  skipFailedRequests: false, // 失败的请求也计入限制
  requestWasSuccessful: (req, res) => res.statusCode < 400, // 定义请求成功的条件
})

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟窗口期
  limit: 90, // 每个IP每分钟最多90个请求
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: createCustomHandler('API请求过于频繁，请稍后再试'),
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
})

// 评论提交限流器（防止垃圾评论）
const commentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5分钟窗口期
  limit: 10, // 每个IP每5分钟最多5个评论
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: createCustomHandler('评论提交过于频繁，请稍后再试'),
  skipSuccessfulRequests: false,
  skipFailedRequests: true, // 失败的请求不计入限制
})

// 管理员API限流器（较宽松）
const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟窗口期
  limit: 30, // 每个IP每分钟最多30个请求
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: createCustomHandler('管理操作过于频繁，请稍后再试'),
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
})

module.exports = {
  globalLimiter,
  apiLimiter,
  commentLimiter,
  adminLimiter,
}
