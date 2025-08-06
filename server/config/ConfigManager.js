/**
 * 配置管理核心模块
 * 实现统一的配置加载和管理机制
 * 配置优先级：环境变量 > .env 文件 > YAML 配置 > 默认值
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const EnvMapper = require('./EnvMapper');
require('dotenv').config();

class ConfigManager {
  constructor() {
    this._cache = new Map();
    this._config = null;
    this._loaded = false;
  }

  /**
   * 加载所有配置源并合并
   * @returns {Object} 合并后的配置对象
   */
  static loadConfig() {
    if (this._instance && this._instance._loaded) {
      return this._instance._config;
    }

    if (!this._instance) {
      this._instance = new ConfigManager();
    }

    const instance = this._instance;

    // 1. 加载默认配置
    const defaultConfig = instance._loadDefaultConfig();

    // 2. 加载 YAML 配置文件
    const yamlConfig = instance._loadYamlConfig();

    // 3. 加载 .env 文件配置（已通过 dotenv 加载到 process.env）
    const envFileConfig = instance._loadEnvFileConfig();

    // 4. 加载环境变量配置
    const envVarConfig = instance._loadEnvironmentVariables();

    // 按优先级合并配置：环境变量 > .env 文件 > YAML 配置 > 默认值
    instance._config = instance._mergeConfigs([
      defaultConfig,
      yamlConfig,
      envFileConfig,
      envVarConfig
    ]);

    instance._loaded = true;
    return instance._config;
  }

  /**
   * 获取特定配置值
   * @param {string} key 配置键，支持点号分隔的嵌套路径
   * @returns {*} 配置值
   */
  static get(key) {
    if (!this._instance || !this._instance._loaded) {
      this.loadConfig();
    }

    // 检查缓存
    if (this._instance._cache.has(key)) {
      return this._instance._cache.get(key);
    }

    const value = this._instance._getNestedValue(this._instance._config, key);

    // 缓存结果
    this._instance._cache.set(key, value);

    return value;
  }

  /**
   * 验证配置完整性和正确性
   * @returns {Array} 验证错误列表
   */
  static validate() {
    const config = this.loadConfig();
    const errors = [];

    // 验证端口配置
    if (config.app.port < 1 || config.app.port > 65535) {
      errors.push('PORT 必须在 1-65535 范围内');
    }

    // 验证集群配置
    if (config.app.cluster.workers < 1 || config.app.cluster.workers > 32) {
      errors.push('CLUSTER_WORKERS 必须在 1-32 范围内');
    }

    // 验证生产环境必要配置
    if (config.app.env === 'production') {
      if (!config.session.secret || config.session.secret === 'your-secret-key-here') {
        errors.push('生产环境必须设置 SESSION_SECRET');
      }

      if (!config.jwt.access.secret || config.jwt.access.secret === 'your-jwt-secret-here') {
        errors.push('生产环境必须设置 JWT_ACCESS_SECRET');
      }

      if (!config.jwt.refresh.secret || config.jwt.refresh.secret === 'your-jwt-refresh-secret-here') {
        errors.push('生产环境必须设置 JWT_REFRESH_SECRET');
      }
    }

    // 验证数据库配置
    if (!config.database.connection.host) {
      errors.push('数据库主机地址不能为空');
    }

    if (!config.database.connection.user) {
      errors.push('数据库用户名不能为空');
    }

    if (!config.database.connection.database) {
      errors.push('数据库名称不能为空');
    }

    return errors;
  }

  /**
   * 获取数据库配置
   * @returns {Object} 数据库配置对象
   */
  static getDatabaseConfig() {
    return this.get('database');
  }

  /**
   * 获取 Redis 配置
   * @returns {Object} Redis 配置对象
   */
  static getRedisConfig() {
    return this.get('redis');
  }

  /**
   * 获取 JWT 配置
   * @returns {Object} JWT 配置对象
   */
  static getJWTConfig() {
    return this.get('jwt');
  }

  /**
   * 获取邮件配置
   * @returns {Object} 邮件配置对象
   */
  static getMailConfig() {
    return this.get('mail');
  }

  /**
   * 清除配置缓存
   */
  static clearCache() {
    if (this._instance) {
      this._instance._cache.clear();
      this._instance._loaded = false;
      this._instance._config = null;
    }
  }

  /**
   * 重新加载配置
   * @returns {Object} 重新加载后的配置对象
   */
  static reload() {
    this.clearCache();
    return this.loadConfig();
  }

  // ==================== 私有方法 ====================

  /**
   * 加载默认配置
   * @returns {Object} 默认配置对象
   */
  _loadDefaultConfig() {
    return {
      app: {
        name: 'SyntaxSeed',
        version: '1.0.0',
        env: 'development',
        port: 7204,
        cluster: {
          enabled: false,
          workers: require('os').cpus().length,
          restartDelay: 1000,
          maxRestarts: 5
        }
      },
      database: {
        client: 'mysql2',
        connection: {
          host: 'localhost',
          port: 3306,
          user: 'root',
          password: '',
          database: 'syntaxseed',
          charset: 'utf8mb4',
          timezone: '+08:00'
        },
        pool: {
          min: 2,
          max: 14,
          acquireTimeoutMillis: 30000,
          idleTimeoutMillis: 30000
        }
      },
      redis: {
        host: 'localhost',
        port: 6379,
        password: null,
        db: 0,
        keyPrefix: 'syntax:',
        connectTimeout: 10000,
        commandTimeout: 5000
      },
      jwt: {
        access: {
          secret: 'your-jwt-secret-here',
          expiresIn: 300
        },
        refresh: {
          secret: 'your-jwt-refresh-secret-here',
          expiresIn: 864000
        }
      },
      session: {
        secret: 'your-secret-key-here'
      },
      mail: {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: '',
          pass: ''
        },
        from: 'SyntaxSeed <noreply@syntaxseed.com>'
      },
      rateLimit: {
        windowMs: 900000,
        maxRequests: 100
      },
      logging: {
        level: 'info',
        file: {
          enabled: true,
          path: './logs'
        }
      }
    };
  }

  /**
   * 加载 YAML 配置文件
   * @returns {Object} YAML 配置对象
   */
  _loadYamlConfig() {
    const yamlPath = path.join(__dirname, '../db.config.yaml');

    try {
      if (fs.existsSync(yamlPath)) {
        const yamlContent = fs.readFileSync(yamlPath, 'utf8');
        const yamlData = yaml.load(yamlContent);

        // 转换 YAML 结构到标准配置结构
        const config = {};

        if (yamlData.db) {
          config.database = yamlData.db;
        }

        if (yamlData.redis) {
          config.redis = yamlData.redis;
        }

        return config;
      }
    } catch (error) {
      console.warn(`⚠️  加载 YAML 配置文件失败: ${error.message}`);
    }

    return {};
  }

  /**
   * 加载 .env 文件配置
   * @returns {Object} .env 文件配置对象
   */
  _loadEnvFileConfig() {
    // .env 文件已通过 dotenv 加载到 process.env
    // 这里我们从 process.env 中提取配置，但只处理明确来自 .env 文件的配置
    return {};
  }

  /**
   * 加载环境变量配置
   * @returns {Object} 环境变量配置对象
   */
  _loadEnvironmentVariables() {
    try {
      // 使用 EnvMapper 来处理所有环境变量映射
      return EnvMapper.mapAllEnv();
    } catch (error) {
      console.error(`❌ 环境变量映射失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 深度合并多个配置对象
   * @param {Array} configs 配置对象数组，按优先级排序
   * @returns {Object} 合并后的配置对象
   */
  _mergeConfigs(configs) {
    const result = {};

    for (const config of configs) {
      this._deepMerge(result, config);
    }

    return result;
  }

  /**
   * 深度合并两个对象
   * @param {Object} target 目标对象
   * @param {Object} source 源对象
   */
  _deepMerge(target, source) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          target[key] = target[key] || {};
          this._deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  }

  /**
   * 获取嵌套对象的值
   * @param {Object} obj 对象
   * @param {string} path 路径，用点号分隔
   * @returns {*} 值
   */
  _getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }
}

// 静态实例
ConfigManager._instance = null;

module.exports = ConfigManager;