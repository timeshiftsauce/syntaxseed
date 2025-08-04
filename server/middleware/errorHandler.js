/**
 * 全局错误处理中间件
 * 根据错误类型返回适当的HTTP状态码和错误信息
 */

// 自定义错误类型
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

// 数据库错误处理
const handleDbConnectionError = () => {
  return new AppError('数据库连接失败，请稍后重试', 503)
}

const handleDbQueryError = () => {
  return new AppError('数据库查询失败，请稍后重试', 500)
}

const handleDbTimeoutError = () => {
  return new AppError('数据库查询超时，请稍后重试', 408)
}

// 请求错误处理
const handleValidationError = (err) => {
  const message = `无效的输入数据: ${err.message}`
  return new AppError(message, 400)
}

const handleTooManyRequestsError = () => {
  return new AppError('请求过于频繁，请稍后重试', 429)
}

// 开发环境错误响应
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: 'error',
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

// 生产环境错误响应
const sendErrorProd = (err, res) => {
  // 可操作的、已知的错误
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: 'error',
      message: err.message,
    })
  } else {
    // 未知错误，不泄露错误详情
    console.error('错误 💥', err)
    res.status(500).json({
      status: 'error',
      message: '服务器内部错误，请稍后重试',
    })
  }
}

// 全局错误处理中间件
const errorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500

  // 记录错误日志
  console.error(`[${new Date().toISOString()}] 错误:`, {
    path: req.path,
    method: req.method,
    message: err.message,
    stack: err.stack,
  })

  // 处理特定类型的错误
  let error = { ...err }
  error.message = err.message

  // 数据库连接错误
  if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
    error = handleDbConnectionError(err)
  }

  // 数据库查询错误
  if (err.code === 'ER_PARSE_ERROR' || err.code === 'ER_BAD_FIELD_ERROR') {
    error = handleDbQueryError(err)
  }

  // 数据库查询超时
  if (err.code === 'ETIMEDOUT' || err.message.includes('timeout')) {
    error = handleDbTimeoutError(err)
  }

  // 验证错误
  if (err.name === 'ValidationError') {
    error = handleValidationError(err)
  }

  // 请求过多错误
  if (err.name === 'TooManyRequestsError') {
    error = handleTooManyRequestsError(err)
  }

  // 根据环境发送不同的错误响应
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res)
  } else {
    sendErrorProd(error, res)
  }
}

module.exports = {
  errorHandler,
  AppError,
}
