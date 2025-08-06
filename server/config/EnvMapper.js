/**
 * 环境变量映射器
 * 处理环境变量到内部配置的映射
 * 支持数据库、Redis、JWT、应用和邮件配置的环境变量映射
 */

class EnvMapper {
  /**
   * 映射数据库环境变量
   * @returns {Object} 数据库配置对象
   */
  static mapDatabaseEnv() {
    const config = {};

    // 基础连接配置映射
    const connectionMapping = {
      DB_HOST: 'host',
      DB_PORT: 'port',
      DB_USER: 'user',
      DB_PASSWORD: 'password',
      DB_NAME: 'database',
      DB_CHARSET: 'charset',
      DB_TIMEZONE: 'timezone'
    };

    // 映射连接配置
    for (const [envVar, configKey] of Object.entries(connectionMapping)) {
      if (process.env[envVar] !== undefined) {
        config.connection = config.connection || {};

        let value = process.env[envVar];

        // 类型转换
        if (envVar === 'DB_PORT') {
          value = parseInt(value, 10);
          // 验证端口范围
          if (isNaN(value) || value < 1 || value > 65535) {
            throw new Error(`DB_PORT 必须是 1-65535 范围内的有效端口号，当前值: ${process.env[envVar]}`);
          }
        }

        config.connection[configKey] = value;
      }
    }

    // 连接池配置映射
    const poolMapping = {
      DB_POOL_MIN: 'min',
      DB_POOL_MAX: 'max',
      DB_POOL_ACQUIRE_TIMEOUT: 'acquireTimeoutMillis',
      DB_POOL_IDLE_TIMEOUT: 'idleTimeoutMillis'
    };

    // 映射连接池配置
    for (const [envVar, configKey] of Object.entries(poolMapping)) {
      if (process.env[envVar] !== undefined) {
        config.pool = config.pool || {};

        const value = parseInt(process.env[envVar], 10);

        // 验证数值
        if (isNaN(value) || value < 0) {
          throw new Error(`${envVar} 必须是非负整数，当前值: ${process.env[envVar]}`);
        }

        // 特殊验证
        if (envVar === 'DB_POOL_MIN' && value < 1) {
          throw new Error(`DB_POOL_MIN 必须至少为 1，当前值: ${value}`);
        }

        if (envVar === 'DB_POOL_MAX' && value < 1) {
          throw new Error(`DB_POOL_MAX 必须至少为 1，当前值: ${value}`);
        }

        config.pool[configKey] = value;
      }
    }

    // 验证连接池配置逻辑
    if (config.pool && config.pool.min && config.pool.max) {
      if (config.pool.min > config.pool.max) {
        throw new Error(`DB_POOL_MIN (${config.pool.min}) 不能大于 DB_POOL_MAX (${config.pool.max})`);
      }
    }

    return Object.keys(config).length > 0 ? config : null;
  }

  /**
   * 映射 Redis 环境变量
   * @returns {Object} Redis 配置对象
   */
  static mapRedisEnv() {
    const config = {};

    // Redis 配置映射
    const redisMapping = {
      REDIS_HOST: 'host',
      REDIS_PORT: 'port',
      REDIS_PASSWORD: 'password',
      REDIS_DB: 'db',
      REDIS_PREFIX: 'keyPrefix',
      REDIS_CONNECT_TIMEOUT: 'connectTimeout',
      REDIS_COMMAND_TIMEOUT: 'commandTimeout'
    };

    // 映射 Redis 配置
    for (const [envVar, configKey] of Object.entries(redisMapping)) {
      if (process.env[envVar] !== undefined) {
        let value = process.env[envVar];

        // 类型转换和验证
        if (['REDIS_PORT', 'REDIS_DB', 'REDIS_CONNECT_TIMEOUT', 'REDIS_COMMAND_TIMEOUT'].includes(envVar)) {
          value = parseInt(value, 10);

          if (isNaN(value) || value < 0) {
            throw new Error(`${envVar} 必须是非负整数，当前值: ${process.env[envVar]}`);
          }

          // 特殊验证
          if (envVar === 'REDIS_PORT' && (value < 1 || value > 65535)) {
            throw new Error(`REDIS_PORT 必须是 1-65535 范围内的有效端口号，当前值: ${value}`);
          }

          if (envVar === 'REDIS_DB' && value > 15) {
            throw new Error(`REDIS_DB 必须是 0-15 范围内的数据库编号，当前值: ${value}`);
          }

          if (envVar === 'REDIS_CONNECT_TIMEOUT' && value < 1000) {
            throw new Error(`REDIS_CONNECT_TIMEOUT 建议至少 1000ms，当前值: ${value}ms`);
          }

          if (envVar === 'REDIS_COMMAND_TIMEOUT' && value < 1000) {
            throw new Error(`REDIS_COMMAND_TIMEOUT 建议至少 1000ms，当前值: ${value}ms`);
          }
        }

        // 处理空字符串密码
        if (envVar === 'REDIS_PASSWORD' && value === '') {
          value = null;
        }

        config[configKey] = value;
      }
    }

    // 兼容旧的 HEARD 环境变量（向后兼容）
    if (process.env.HEARD && !process.env.REDIS_PREFIX) {
      config.keyPrefix = process.env.HEARD;
      console.warn('⚠️  HEARD 环境变量已弃用，请使用 REDIS_PREFIX 替代');
    }

    return Object.keys(config).length > 0 ? config : null;
  }

  /**
   * 映射 JWT 环境变量
   * @returns {Object} JWT 配置对象
   */
  static mapJWTEnv() {
    const config = {};

    // JWT 访问令牌配置
    if (process.env.JWT_ACCESS_SECRET || process.env.JWT_ACC_SECRET) {
      config.access = config.access || {};
      const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_ACC_SECRET;

      // 验证密钥强度
      if (secret.length < 14) {
        throw new Error('JWT_ACCESS_SECRET 长度至少需要 14 个字符以确保安全性');
      }

      config.access.secret = secret;

      // 向后兼容性警告
      if (process.env.JWT_ACC_SECRET && !process.env.JWT_ACCESS_SECRET) {
        console.warn('⚠️  JWT_ACC_SECRET 已弃用，请使用 JWT_ACCESS_SECRET 替代');
      }
    }

    if (process.env.JWT_ACCESS_EXPIRES_IN || process.env.JWT_ACC_EXPIRES_IN) {
      config.access = config.access || {};
      const expiresIn = parseInt(process.env.JWT_ACCESS_EXPIRES_IN || process.env.JWT_ACC_EXPIRES_IN, 10);

      // 验证过期时间合理性
      if (isNaN(expiresIn) || expiresIn < 60) {
        throw new Error('JWT_ACCESS_EXPIRES_IN 必须至少为 60 秒');
      }

      if (expiresIn > 86400) { // 24小时
        console.warn('⚠️  JWT 访问令牌过期时间超过 24 小时，可能存在安全风险');
      }

      config.access.expiresIn = expiresIn;

      // 向后兼容性警告
      if (process.env.JWT_ACC_EXPIRES_IN && !process.env.JWT_ACCESS_EXPIRES_IN) {
        console.warn('⚠️  JWT_ACC_EXPIRES_IN 已弃用，请使用 JWT_ACCESS_EXPIRES_IN 替代');
      }
    }

    // JWT 刷新令牌配置
    if (process.env.JWT_REFRESH_SECRET || process.env.JWT_REF_SECRET) {
      config.refresh = config.refresh || {};
      const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_REF_SECRET;

      // 验证密钥强度
      if (secret.length < 14) {
        throw new Error('JWT_REFRESH_SECRET 长度至少需要 14 个字符以确保安全性');
      }

      config.refresh.secret = secret;

      // 向后兼容性警告
      if (process.env.JWT_REF_SECRET && !process.env.JWT_REFRESH_SECRET) {
        console.warn('⚠️  JWT_REF_SECRET 已弃用，请使用 JWT_REFRESH_SECRET 替代');
      }
    }

    if (process.env.JWT_REFRESH_EXPIRES_IN || process.env.JWT_REF_EXPIRES_IN) {
      config.refresh = config.refresh || {};
      const expiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || process.env.JWT_REF_EXPIRES_IN, 10);

      // 验证过期时间合理性
      if (isNaN(expiresIn) || expiresIn < 3600) { // 至少1小时
        throw new Error('JWT_REFRESH_EXPIRES_IN 必须至少为 3600 秒（1小时）');
      }

      if (expiresIn > 2592000) { // 30天
        console.warn('⚠️  JWT 刷新令牌过期时间超过 30 天，可能存在安全风险');
      }

      config.refresh.expiresIn = expiresIn;

      // 向后兼容性警告
      if (process.env.JWT_REF_EXPIRES_IN && !process.env.JWT_REFRESH_EXPIRES_IN) {
        console.warn('⚠️  JWT_REF_EXPIRES_IN 已弃用，请使用 JWT_REFRESH_EXPIRES_IN 替代');
      }
    }

    // 会话密钥配置
    if (process.env.SESSION_SECRET) {
      const sessionSecret = process.env.SESSION_SECRET;

      // 验证会话密钥强度
      if (sessionSecret.length < 14) {
        throw new Error('SESSION_SECRET 长度至少需要 14 个字符以确保安全性');
      }

      if (sessionSecret === 'your-secret-key-here') {
        throw new Error('SESSION_SECRET 不能使用默认值，请设置安全的密钥');
      }

      // 这里不直接返回 session 配置，因为它不属于 JWT 配置
      // 但我们在这里验证，实际配置会在 mapAppEnv 中处理
    }

    return Object.keys(config).length > 0 ? config : null;
  }

  /**
   * 映射应用环境变量
   * @returns {Object} 应用配置对象
   */
  static mapAppEnv() {
    const config = {};

    // 基础应用配置
    if (process.env.NODE_ENV) {
      config.env = process.env.NODE_ENV;

      // 验证环境值
      const validEnvs = ['development', 'production', 'test'];
      if (!validEnvs.includes(config.env)) {
        throw new Error(`NODE_ENV 必须是以下值之一: ${validEnvs.join(', ')}，当前值: ${config.env}`);
      }
    }

    if (process.env.PORT) {
      const port = parseInt(process.env.PORT, 10);

      // 验证端口范围
      if (isNaN(port) || port < 1 || port > 65535) {
        throw new Error(`PORT 必须是 1-65535 范围内的有效端口号，当前值: ${process.env.PORT}`);
      }

      config.port = port;
    }

    if (process.env.APP_NAME) {
      config.name = process.env.APP_NAME;
    }

    if (process.env.APP_VERSION) {
      config.version = process.env.APP_VERSION;
    }

    // 集群配置
    if (process.env.CLUSTER_ENABLED !== undefined) {
      config.cluster = config.cluster || {};
      config.cluster.enabled = process.env.CLUSTER_ENABLED === 'true';
    }

    if (process.env.CLUSTER_WORKERS) {
      config.cluster = config.cluster || {};
      const workers = parseInt(process.env.CLUSTER_WORKERS, 10);

      // 验证工作进程数量
      if (isNaN(workers) || workers < 1) {
        throw new Error('CLUSTER_WORKERS 必须是正整数');
      }

      const maxWorkers = require('os').cpus().length * 2; // 建议最大值
      if (workers > maxWorkers) {
        console.warn(`⚠️  CLUSTER_WORKERS (${workers}) 超过建议的最大值 (${maxWorkers})`);
      }

      config.cluster.workers = workers;
    }

    if (process.env.CLUSTER_RESTART_DELAY) {
      config.cluster = config.cluster || {};
      const restartDelay = parseInt(process.env.CLUSTER_RESTART_DELAY, 10);

      if (isNaN(restartDelay) || restartDelay < 0) {
        throw new Error('CLUSTER_RESTART_DELAY 必须是非负整数');
      }

      config.cluster.restartDelay = restartDelay;
    }

    if (process.env.CLUSTER_MAX_RESTARTS) {
      config.cluster = config.cluster || {};
      const maxRestarts = parseInt(process.env.CLUSTER_MAX_RESTARTS, 10);

      if (isNaN(maxRestarts) || maxRestarts < 0) {
        throw new Error('CLUSTER_MAX_RESTARTS 必须是非负整数');
      }

      config.cluster.maxRestarts = maxRestarts;
    }

    // 限流配置
    if (process.env.RATE_LIMIT_WINDOW_MS) {
      config.rateLimit = config.rateLimit || {};
      const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10);

      if (isNaN(windowMs) || windowMs < 1000) {
        throw new Error('RATE_LIMIT_WINDOW_MS 必须至少为 1000ms');
      }

      config.rateLimit.windowMs = windowMs;
    }

    if (process.env.RATE_LIMIT_MAX_REQUESTS) {
      config.rateLimit = config.rateLimit || {};
      const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10);

      if (isNaN(maxRequests) || maxRequests < 1) {
        throw new Error('RATE_LIMIT_MAX_REQUESTS 必须是正整数');
      }

      config.rateLimit.maxRequests = maxRequests;
    }

    // 会话配置
    if (process.env.SESSION_SECRET) {
      const sessionSecret = process.env.SESSION_SECRET;

      // 验证会话密钥强度
      if (sessionSecret.length < 14) {
        throw new Error('SESSION_SECRET 长度至少需要 14 个字符以确保安全性');
      }

      if (sessionSecret === 'your-secret-key-here') {
        throw new Error('SESSION_SECRET 不能使用默认值，请设置安全的密钥');
      }

      config.session = { secret: sessionSecret };
    }

    // 日志配置
    if (process.env.LOG_LEVEL) {
      config.logging = config.logging || {};
      const logLevel = process.env.LOG_LEVEL.toLowerCase();

      const validLevels = ['error', 'warn', 'info', 'debug', 'verbose'];
      if (!validLevels.includes(logLevel)) {
        throw new Error(`LOG_LEVEL 必须是以下值之一: ${validLevels.join(', ')}，当前值: ${logLevel}`);
      }

      config.logging.level = logLevel;
    }

    if (process.env.LOG_FILE_ENABLED !== undefined) {
      config.logging = config.logging || {};
      config.logging.file = config.logging.file || {};
      config.logging.file.enabled = process.env.LOG_FILE_ENABLED === 'true';
    }

    if (process.env.LOG_FILE_PATH) {
      config.logging = config.logging || {};
      config.logging.file = config.logging.file || {};
      config.logging.file.path = process.env.LOG_FILE_PATH;
    }

    return Object.keys(config).length > 0 ? config : null;
  }

  /**
   * 映射邮件环境变量
   * @returns {Object} 邮件配置对象
   */
  static mapMailEnv() {
    const config = {};

    // 基础邮件服务器配置
    if (process.env.MAIL_HOST) {
      config.host = process.env.MAIL_HOST;
    }

    if (process.env.MAIL_PORT) {
      const port = parseInt(process.env.MAIL_PORT, 10);

      // 验证端口范围
      if (isNaN(port) || port < 1 || port > 65535) {
        throw new Error(`MAIL_PORT 必须是 1-65535 范围内的有效端口号，当前值: ${process.env.MAIL_PORT}`);
      }

      // 常见邮件端口验证
      const commonPorts = [25, 465, 587, 993, 995];
      if (!commonPorts.includes(port)) {
        console.warn(`⚠️  MAIL_PORT (${port}) 不是常见的邮件服务端口，请确认配置正确`);
      }

      config.port = port;
    }

    if (process.env.MAIL_SECURE !== undefined) {
      config.secure = process.env.MAIL_SECURE === 'true';

      // 端口和安全性匹配验证
      if (config.port) {
        if (config.secure && config.port !== 465) {
          console.warn('⚠️  启用 SSL/TLS 时，建议使用端口 465');
        } else if (!config.secure && config.port === 465) {
          console.warn('⚠️  端口 465 通常需要启用 SSL/TLS');
        }
      }
    }

    // 认证配置
    if (process.env.MAIL_USER || process.env.MAIL_PASS) {
      config.auth = {};

      if (process.env.MAIL_USER) {
        const user = process.env.MAIL_USER;

        // 基础邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user)) {
          throw new Error(`MAIL_USER 必须是有效的邮箱地址，当前值: ${user}`);
        }

        config.auth.user = user;
      }

      if (process.env.MAIL_PASS) {
        const pass = process.env.MAIL_PASS;

        if (pass.length < 6) {
          console.warn('⚠️  MAIL_PASS 长度较短，建议使用应用专用密码');
        }

        config.auth.pass = pass;
      }
    }

    // 发件人配置
    if (process.env.MAIL_FROM) {
      const from = process.env.MAIL_FROM;

      // 验证发件人格式：支持 "Name <email@domain.com>" 或 "email@domain.com"
      const fromRegex = /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|"[^"]*")\s*<[^\s@]+@[^\s@]+\.[^\s@]+>$|^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!fromRegex.test(from)) {
        throw new Error(`MAIL_FROM 格式不正确，应为 "Name <email@domain.com>" 或 "email@domain.com"，当前值: ${from}`);
      }

      config.from = from;
    }

    return Object.keys(config).length > 0 ? config : null;
  }

  /**
   * 映射所有环境变量
   * @returns {Object} 完整的配置对象
   */
  static mapAllEnv() {
    const config = {};

    try {
      // 映射应用配置
      const appConfig = this.mapAppEnv();
      if (appConfig) {
        // 处理嵌套的 session 配置
        if (appConfig.session) {
          config.session = appConfig.session;
          delete appConfig.session;
        }

        // 处理嵌套的 logging 配置
        if (appConfig.logging) {
          config.logging = appConfig.logging;
          delete appConfig.logging;
        }

        // 处理嵌套的 rateLimit 配置
        if (appConfig.rateLimit) {
          config.rateLimit = appConfig.rateLimit;
          delete appConfig.rateLimit;
        }

        config.app = appConfig;
      }

      // 映射数据库配置
      const databaseConfig = this.mapDatabaseEnv();
      if (databaseConfig) {
        config.database = databaseConfig;
      }

      // 映射 Redis 配置
      const redisConfig = this.mapRedisEnv();
      if (redisConfig) {
        config.redis = redisConfig;
      }

      // 映射 JWT 配置
      const jwtConfig = this.mapJWTEnv();
      if (jwtConfig) {
        config.jwt = jwtConfig;
      }

      // 映射邮件配置
      const mailConfig = this.mapMailEnv();
      if (mailConfig) {
        config.mail = mailConfig;
      }

      return config;
    } catch (error) {
      // 重新抛出错误，保持错误信息
      throw error;
    }
  }

  /**
   * 验证环境变量配置的完整性
   * @returns {Array} 验证错误列表
   */
  static validateEnvConfig() {
    const errors = [];

    try {
      // 尝试映射所有配置
      this.mapAllEnv();
    } catch (error) {
      errors.push(error.message);
    }

    // 生产环境必要配置检查
    if (process.env.NODE_ENV === 'production') {
      const requiredProdEnvs = [
        'SESSION_SECRET',
        'JWT_ACCESS_SECRET',
        'JWT_REFRESH_SECRET'
      ];

      for (const envVar of requiredProdEnvs) {
        if (!process.env[envVar]) {
          errors.push(`生产环境必须设置 ${envVar}`);
        }
      }
    }

    return errors;
  }

  /**
   * 获取所有支持的环境变量列表
   * @returns {Object} 按类别分组的环境变量列表
   */
  static getSupportedEnvVars() {
    return {
      app: [
        'NODE_ENV',
        'PORT',
        'APP_NAME',
        'APP_VERSION',
        'CLUSTER_ENABLED',
        'CLUSTER_WORKERS',
        'CLUSTER_RESTART_DELAY',
        'CLUSTER_MAX_RESTARTS',
        'RATE_LIMIT_WINDOW_MS',
        'RATE_LIMIT_MAX_REQUESTS',
        'SESSION_SECRET',
        'LOG_LEVEL',
        'LOG_FILE_ENABLED',
        'LOG_FILE_PATH'
      ],
      database: [
        'DB_HOST',
        'DB_PORT',
        'DB_USER',
        'DB_PASSWORD',
        'DB_NAME',
        'DB_CHARSET',
        'DB_TIMEZONE',
        'DB_POOL_MIN',
        'DB_POOL_MAX',
        'DB_POOL_ACQUIRE_TIMEOUT',
        'DB_POOL_IDLE_TIMEOUT'
      ],
      redis: [
        'REDIS_HOST',
        'REDIS_PORT',
        'REDIS_PASSWORD',
        'REDIS_DB',
        'REDIS_PREFIX',
        'REDIS_CONNECT_TIMEOUT',
        'REDIS_COMMAND_TIMEOUT',
        'HEARD' // 向后兼容
      ],
      jwt: [
        'JWT_ACCESS_SECRET',
        'JWT_ACCESS_EXPIRES_IN',
        'JWT_REFRESH_SECRET',
        'JWT_REFRESH_EXPIRES_IN',
        'JWT_ACC_SECRET', // 向后兼容
        'JWT_ACC_EXPIRES_IN', // 向后兼容
        'JWT_REF_SECRET', // 向后兼容
        'JWT_REF_EXPIRES_IN' // 向后兼容
      ],
      mail: [
        'MAIL_HOST',
        'MAIL_PORT',
        'MAIL_SECURE',
        'MAIL_USER',
        'MAIL_PASS',
        'MAIL_FROM'
      ]
    };
  }
}

module.exports = EnvMapper;