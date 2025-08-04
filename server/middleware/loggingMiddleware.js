const logger = require('../logger')

function formatCustomTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const milliseconds = String(date.getMilliseconds())
    .padStart(3, '0')
    .slice(0, 2)

  return `${year}/${month}/${day}-${hours}:${minutes}:${seconds}.${milliseconds}`
}

function loggingMiddleware(req, res, next) {
  const start = Date.now()
  const startTime = new Date()

  // 记录请求开始
  logger.http({
    event: 'REQUEST_START',
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  })

  // 捕获响应完成事件
  res.on('finish', () => {
    const duration = Date.now() - start

    const logData = {
      event: 'REQUEST_END',
      timestamp: formatCustomTime(startTime),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    }

    // 根据状态码决定日志级别
    if (res.statusCode >= 500) {
      logger.error(logData)
    } else if (res.statusCode >= 400) {
      logger.warn(logData)
    } else {
      logger.info(logData)
    }
  })

  // 错误处理
  res.on('error', (err) => {
    logger.error({
      event: 'RESPONSE_ERROR',
      error: err.stack,
      request: {
        method: req.method,
        url: req.originalUrl,
        timestamp: formatCustomTime(new Date()),
      },
    })
  })

  next()
}

function errorHandlingMiddleware(err, req, res, next) {
  logger.error({
    event: 'UNHANDLED_EXCEPTION',
    error: err.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      timestamp: formatCustomTime(new Date()),
    },
  })

  res.status(500).json({
    error: 'Internal Server Error',
    timestamp: formatCustomTime(new Date()),
  })

  next()
}

module.exports = {
  loggingMiddleware,
  errorHandlingMiddleware,
  formatCustomTime,
}
