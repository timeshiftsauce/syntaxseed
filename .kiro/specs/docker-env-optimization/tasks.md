# 实施计划

- [x] 1. 创建配置管理核心模块

  - 创建 `server/config/ConfigManager.js` 类，实现统一的配置加载和管理机制
  - 实现配置优先级处理：环境变量 > .env 文件 > YAML 配置 > 默认值
  - 添加配置缓存机制，避免重复加载和解析
  - _需求: 1.6, 2.6, 3.6, 4.6, 5.7_

- [x] 2. 实现环境变量映射器

  - 创建 `server/config/EnvMapper.js` 类，处理环境变量到内部配置的映射
  - 实现数据库环境变量映射（DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME 等）
  - 实现 Redis 环境变量映射（REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_PREFIX 等）
  - 实现 JWT 环境变量映射（JWT_ACCESS_SECRET, JWT_REFRESH_SECRET 等）
  - 实现应用和邮件环境变量映射
  - _需求: 1.1-1.6, 2.1-2.5, 3.1-3.6, 4.1-4.6, 5.1-5.7_

- [ ] 3. 创建配置验证器

  - 创建 `server/config/ConfigValidator.js` 类，实现配置验证逻辑
  - 实现数据库配置验证（主机地址、端口范围、连接池参数等）
  - 实现 Redis 配置验证（连接参数、超时设置等）
  - 实现 JWT 配置验证（密钥强度、过期时间合理性等）
  - 实现邮件配置验证（SMTP 参数、邮箱格式等）
  - 添加生产环境必要配置检查
  - _需求: 6.4, 6.5_

- [x] 4. 重构现有配置加载逻辑

  - 更新 `server/config/env.js`，集成新的配置管理系统
  - 保持向后兼容性，支持现有的配置访问方式
  - 添加配置迁移检查和警告机制
  - 更新 `getDatabaseOverrides()` 函数，使用新的环境变量映射
  - _需求: 1.6, 2.6, 3.6, 4.6, 5.7_

- [x] 5. 更新数据库连接模块

  - 修改 `server/db.js`，使用新的配置管理系统
  - 实现 Redis 配置的环境变量支持
  - 添加连接池配置的环境变量支持（DB_POOL_MIN, DB_POOL_MAX 等）
  - 更新连接错误处理，提供更清晰的配置错误信息
  - _需求: 1.1-1.6, 2.1-2.5_

- [ ] 6. 创建环境变量模板和文档

  - 创建 `.env.example` 文件，包含所有支持的环境变量及说明
  - 创建 `docker-compose.override.yml.example` 文件，展示 Docker 环境变量配置
  - 更新 `README.md`，添加环境变量配置章节
  - 创建环境变量迁移指南文档
  - _需求: 6.1, 6.2, 6.3_

- [x] 7. 更新 Docker 配置

  - 更新 `docker-compose.yml`，添加完整的环境变量配置示例
  - 修改 `server/Dockerfile`，确保环境变量正确传递
  - 添加 Docker 健康检查，验证配置是否正确加载
  - 创建多环境 Docker Compose 配置（开发、测试、生产）
  - _需求: 1.1-1.6, 2.1-2.5, 3.1-3.6, 4.1-4.6, 5.1-5.7_

- [ ] 8. 实现配置错误处理和日志

  - 创建 `server/config/ConfigError.js` 自定义错误类
  - 实现配置错误的详细日志记录
  - 添加配置修复建议机制
  - 实现启动时配置验证和错误报告
  - _需求: 6.4, 6.5_

- [ ] 9. 编写配置管理单元测试

  - 创建 `server/tests/config/ConfigManager.test.js`，测试配置加载和合并逻辑
  - 创建 `server/tests/config/EnvMapper.test.js`，测试环境变量映射功能
  - 创建 `server/tests/config/ConfigValidator.test.js`，测试配置验证逻辑
  - 测试各种配置错误场景和边界条件
  - _需求: 6.4, 6.5_

- [ ] 10. 编写集成测试

  - 创建 `server/tests/integration/database-config.test.js`，测试数据库配置集成
  - 创建 `server/tests/integration/redis-config.test.js`，测试 Redis 配置集成
  - 创建 `server/tests/integration/docker-env.test.js`，测试 Docker 环境变量传递
  - 测试完整的应用启动流程和配置加载
  - _需求: 1.1-1.6, 2.1-2.5, 3.1-3.6, 4.1-4.6, 5.1-5.7_

- [ ] 11. 更新应用启动流程

  - 修改 `server/index.js`，在启动时进行配置验证
  - 添加配置加载状态的详细日志输出
  - 实现配置热重载机制（开发环境）
  - 更新健康检查端点，包含配置状态信息
  - _需求: 6.4, 6.5_

- [ ] 12. 创建配置管理工具脚本
  - 创建 `server/scripts/validate-config.js`，用于验证配置文件
  - 创建 `server/scripts/migrate-config.js`，用于配置迁移
  - 创建 `server/scripts/generate-env.js`，用于生成环境变量模板
  - 添加 npm scripts 支持配置管理命令
  - _需求: 6.1, 6.2, 6.3_
