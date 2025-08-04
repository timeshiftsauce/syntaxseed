const winston = require('winston')
const { combine, printf } = winston.format
const path = require('path')
const fs = require('fs')

// 确保日志目录存在
const logDir = 'logs'
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

// 自定义时间格式化函数
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

// 自定义日志格式
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: `

  if (typeof message === 'object') {
    msg += JSON.stringify(message, null, 2)
  } else {
    msg += message
  }

  if (metadata && Object.keys(metadata).length > 0) {
    msg += '\n' + JSON.stringify(metadata, null, 2)
  }

  return msg
})

// 创建 logger 实例
const logger = winston.createLogger({
  level: 'info',
  format: combine(
    winston.format((info) => {
      info.timestamp = formatCustomTime(new Date())
      return info
    })(),
    logFormat,
  ),
  transports: [
    // 控制台输出（带颜色）
    new winston.transports.Console({
      format: combine(winston.format.colorize(), logFormat),
      level: 'debug',
    }),
    // 普通请求日志文件
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      level: 'info',
    }),
    // 错误日志单独存储
    new winston.transports.File({
      filename: path.join(logDir, 'errors.log'),
      level: 'error',
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
    }),
  ],
})


// 包装logger方法，确保始终记录完整对象
const wrappedLogger = {
  info: (message, meta) =>
    logger.info(typeof message === 'object' ? message : { message, ...meta }),
  warn: (message, meta) =>
    logger.warn(typeof message === 'object' ? message : { message, ...meta }),
  error: (message, meta) =>
    logger.error(typeof message === 'object' ? message : { message, ...meta }),
  debug: (message, meta) =>
    logger.debug(message),
  http: (message, meta) =>
    logger.http(typeof message === 'object' ? message : { message, ...meta }),
}

module.exports = wrappedLogger
