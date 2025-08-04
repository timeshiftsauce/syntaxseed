module.exports = {
  apps: [{
    name: 'syntaxseed-server',
    script: './index.js',
    instances: process.env.CLUSTER_ENABLED === 'true' ? (process.env.CLUSTER_WORKERS || 'max') : 1,
    exec_mode: process.env.CLUSTER_ENABLED === 'true' ? 'cluster' : 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 7204,

      // 数据库配置
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME,
      DB_CHARSET: process.env.DB_CHARSET,
      DB_TIMEZONE: process.env.DB_TIMEZONE,

      // 数据库连接池配置
      DB_POOL_MIN: process.env.DB_POOL_MIN,
      DB_POOL_MAX: process.env.DB_POOL_MAX,
      DB_POOL_ACQUIRE_TIMEOUT: process.env.DB_POOL_ACQUIRE_TIMEOUT,
      DB_POOL_IDLE_TIMEOUT: process.env.DB_POOL_IDLE_TIMEOUT,

      // Redis 配置
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      REDIS_DB: process.env.REDIS_DB,
      REDIS_PREFIX: process.env.REDIS_PREFIX,
      REDIS_CONNECT_TIMEOUT: process.env.REDIS_CONNECT_TIMEOUT,
      REDIS_COMMAND_TIMEOUT: process.env.REDIS_COMMAND_TIMEOUT,

      // JWT 配置
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
      JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
      JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
      SESSION_SECRET: process.env.SESSION_SECRET,

      // 邮件配置
      MAIL_HOST: process.env.MAIL_HOST,
      MAIL_PORT: process.env.MAIL_PORT,
      MAIL_SECURE: process.env.MAIL_SECURE,
      MAIL_USER: process.env.MAIL_USER,
      MAIL_PASS: process.env.MAIL_PASS,
      MAIL_FROM: process.env.MAIL_FROM,

      // 应用配置
      APP_NAME: process.env.APP_NAME,
      APP_VERSION: process.env.APP_VERSION,
      CLUSTER_ENABLED: process.env.CLUSTER_ENABLED,
      CLUSTER_WORKERS: process.env.CLUSTER_WORKERS,

      // 限流配置
      RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
      RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,

      // 日志配置
      LOG_LEVEL: process.env.LOG_LEVEL,
      LOG_FILE_ENABLED: process.env.LOG_FILE_ENABLED,
      LOG_FILE_PATH: process.env.LOG_FILE_PATH,

      // 监控配置
      MONITOR_INTERVAL: process.env.MONITOR_INTERVAL,
      HEALTH_CHECK_TIMEOUT: process.env.HEALTH_CHECK_TIMEOUT,

      // 性能配置
      REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT,
      KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT
    },
    error_file: process.env.LOG_FILE_ENABLED === 'true' ? '/app/logs/pm2-error.log' : '/dev/null',
    out_file: process.env.LOG_FILE_ENABLED === 'true' ? '/app/logs/pm2-out.log' : '/dev/null',
    log_file: process.env.LOG_FILE_ENABLED === 'true' ? '/app/logs/pm2-combined.log' : '/dev/null',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};