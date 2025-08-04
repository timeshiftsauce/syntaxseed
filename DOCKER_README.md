# Docker 环境配置指南

本文档介绍如何使用 Docker 部署 SyntaxSeed 应用的不同环境配置。

## 快速开始

### 1. 使用环境管理脚本

我们提供了便捷的环境管理脚本来简化 Docker 操作：

**Linux/macOS:**

```bash
# 启动开发环境
./docker-env.sh dev up

# 启动生产环境
./docker-env.sh prod up

# 查看服务状态
./docker-env.sh dev ps

# 检查健康状态
./docker-env.sh dev health
```

**Windows:**

```cmd
# 启动开发环境
docker-env.bat dev up

# 启动生产环境
docker-env.bat prod up

# 查看服务状态
docker-env.bat dev ps

# 检查健康状态
docker-env.bat dev health
```

### 2. 直接使用 Docker Compose

```bash
# 开发环境
docker-compose -f docker-compose.dev.yml up -d

# 测试环境
docker-compose -f docker-compose.test.yml up -d

# 生产环境
docker-compose -f docker-compose.prod.yml up -d

# 默认环境
docker-compose up -d
```

## 环境配置

### 开发环境 (docker-compose.dev.yml)

**特点:**

- 启用热重载
- 详细的调试日志
- 较宽松的限流配置
- 简化的安全配置
- 无需 HTTPS

**端口映射:**

- 前端: http://localhost:3000
- 后端: http://localhost:7204
- 数据库: localhost:3306
- Redis: localhost:6379

**环境变量:**

```bash
NODE_ENV=development
CLUSTER_ENABLED=false
LOG_LEVEL=debug
JWT_ACCESS_EXPIRES_IN=3600  # 1小时
RATE_LIMIT_MAX_REQUESTS=100
```

### 测试环境 (docker-compose.test.yml)

**特点:**

- 单进程模式
- 最小资源配置
- 包含 MailHog 邮件测试服务
- 使用独立的测试数据库

**端口映射:**

- 前端: http://localhost:8080
- 后端: http://localhost:7204
- 数据库: localhost:3307
- Redis: localhost:6380
- MailHog Web UI: http://localhost:8025

**环境变量:**

```bash
NODE_ENV=test
CLUSTER_ENABLED=false
LOG_LEVEL=warn
DB_NAME=syntaxseed_test
REDIS_DB=1
```

### 生产环境 (docker-compose.prod.yml)

**特点:**

- 集群模式
- 使用 Docker Secrets 管理敏感信息
- 包含监控服务 (Prometheus + Grafana)
- 资源限制和健康检查
- SSL/TLS 支持

**端口映射:**

- 前端: http://localhost:80, https://localhost:443
- 后端: http://localhost:7204
- 数据库: 127.0.0.1:3306 (仅本地访问)
- Redis: 127.0.0.1:6379 (仅本地访问)
- Prometheus: http://127.0.0.1:9090
- Grafana: http://127.0.0.1:3001

**环境变量:**

```bash
NODE_ENV=production
CLUSTER_ENABLED=true
CLUSTER_WORKERS=4
LOG_LEVEL=info
RATE_LIMIT_MAX_REQUESTS=100
```

## 环境变量配置

### 数据库配置

| 变量名        | 描述           | 默认值     | 示例                 |
| ------------- | -------------- | ---------- | -------------------- |
| `DB_HOST`     | 数据库主机地址 | localhost  | database             |
| `DB_PORT`     | 数据库端口     | 3306       | 3306                 |
| `DB_USER`     | 数据库用户名   | root       | syntaxseed_user      |
| `DB_PASSWORD` | 数据库密码     | -          | your-secure-password |
| `DB_NAME`     | 数据库名称     | syntaxseed | syntaxseed           |
| `DB_CHARSET`  | 字符集         | utf8mb4    | utf8mb4              |
| `DB_TIMEZONE` | 时区           | +08:00     | +08:00               |

### 连接池配置

| 变量名                    | 描述             | 默认值 | 生产建议 |
| ------------------------- | ---------------- | ------ | -------- |
| `DB_POOL_MIN`             | 最小连接数       | 2      | 5        |
| `DB_POOL_MAX`             | 最大连接数       | 14     | 20       |
| `DB_POOL_ACQUIRE_TIMEOUT` | 获取连接超时(ms) | 30000  | 30000    |
| `DB_POOL_IDLE_TIMEOUT`    | 空闲连接超时(ms) | 30000  | 300000   |

### Redis 配置

| 变量名                  | 描述             | 默认值    | 示例                |
| ----------------------- | ---------------- | --------- | ------------------- |
| `REDIS_HOST`            | Redis 主机地址   | localhost | redis               |
| `REDIS_PORT`            | Redis 端口       | 6379      | 6379                |
| `REDIS_PASSWORD`        | Redis 密码       | -         | your-redis-password |
| `REDIS_DB`              | Redis 数据库编号 | 0         | 0                   |
| `REDIS_PREFIX`          | Redis 键前缀     | syntax:   | syntax:prod:        |
| `REDIS_CONNECT_TIMEOUT` | 连接超时(ms)     | 10000     | 10000               |
| `REDIS_COMMAND_TIMEOUT` | 命令超时(ms)     | 5000      | 5000                |

### JWT 配置

| 变量名                   | 描述                 | 默认值 | 安全建议                 |
| ------------------------ | -------------------- | ------ | ------------------------ |
| `JWT_ACCESS_SECRET`      | 访问令牌密钥         | -      | 至少 32 字符的随机字符串 |
| `JWT_ACCESS_EXPIRES_IN`  | 访问令牌过期时间(秒) | 300    | 300-3600                 |
| `JWT_REFRESH_SECRET`     | 刷新令牌密钥         | -      | 至少 32 字符的随机字符串 |
| `JWT_REFRESH_EXPIRES_IN` | 刷新令牌过期时间(秒) | 864000 | 604800-2592000           |
| `SESSION_SECRET`         | 会话密钥             | -      | 至少 32 字符的随机字符串 |

### 邮件配置

| 变量名        | 描述             | 默认值 | 示例                                |
| ------------- | ---------------- | ------ | ----------------------------------- |
| `MAIL_HOST`   | SMTP 服务器地址  | -      | smtp.gmail.com                      |
| `MAIL_PORT`   | SMTP 端口        | 587    | 587                                 |
| `MAIL_SECURE` | 是否使用 SSL/TLS | false  | true                                |
| `MAIL_USER`   | 邮箱用户名       | -      | your-email@gmail.com                |
| `MAIL_PASS`   | 邮箱密码         | -      | your-app-password                   |
| `MAIL_FROM`   | 发件人地址       | -      | SyntaxSeed <noreply@yourdomain.com> |

### 应用配置

| 变量名            | 描述         | 默认值     | 示例                        |
| ----------------- | ------------ | ---------- | --------------------------- |
| `NODE_ENV`        | 运行环境     | production | development/test/production |
| `PORT`            | 服务端口     | 7204       | 7204                        |
| `APP_NAME`        | 应用名称     | SyntaxSeed | Your App Name               |
| `APP_VERSION`     | 应用版本     | 1.0.0      | 1.0.0                       |
| `CLUSTER_ENABLED` | 是否启用集群 | true       | true/false                  |
| `CLUSTER_WORKERS` | 工作进程数   | 2          | 2-8                         |

### 限流配置

| 变量名                    | 描述             | 默认值 | 生产建议 |
| ------------------------- | ---------------- | ------ | -------- |
| `RATE_LIMIT_WINDOW_MS`    | 限流时间窗口(ms) | 900000 | 900000   |
| `RATE_LIMIT_MAX_REQUESTS` | 最大请求数       | 1000   | 100-1000 |

### 日志配置

| 变量名             | 描述             | 默认值 | 选项                  |
| ------------------ | ---------------- | ------ | --------------------- |
| `LOG_LEVEL`        | 日志级别         | info   | error/warn/info/debug |
| `LOG_FILE_ENABLED` | 是否启用文件日志 | true   | true/false            |
| `LOG_FILE_PATH`    | 日志文件路径     | ./logs | ./logs                |

## 自定义配置

### 1. 使用覆盖文件

复制 `docker-compose.override.yml.example` 为 `docker-compose.override.yml`：

```bash
cp docker-compose.override.yml.example docker-compose.override.yml
```

编辑 `docker-compose.override.yml` 文件，添加你的自定义配置。

### 2. 环境变量文件

创建 `.env` 文件来设置环境变量：

```bash
# .env 文件示例
DB_HOST=your-database-host
DB_PASSWORD=your-secure-password
REDIS_PASSWORD=your-redis-password
JWT_ACCESS_SECRET=your-jwt-secret
MAIL_HOST=smtp.your-provider.com
MAIL_USER=your-email@domain.com
MAIL_PASS=your-email-password
```

### 3. Docker Secrets (生产环境)

对于生产环境，建议使用 Docker Secrets 管理敏感信息：

```bash
# 创建 secrets
echo "your-db-password" | docker secret create db_password -
echo "your-redis-password" | docker secret create redis_password -
echo "your-jwt-access-secret" | docker secret create jwt_access_secret -
echo "your-jwt-refresh-secret" | docker secret create jwt_refresh_secret -
echo "your-session-secret" | docker secret create session_secret -
echo "your-email-password" | docker secret create mail_password -
echo "your-mysql-root-password" | docker secret create mysql_root_password -
echo "your-grafana-password" | docker secret create grafana_password -
```

## 健康检查

所有环境都包含健康检查功能：

### 检查方式

1. **使用管理脚本:**

   ```bash
   ./docker-env.sh dev health
   ```

2. **直接访问健康端点:**

   ```bash
   curl http://localhost:7204/api/health
   ```

3. **查看 Docker 健康状态:**
   ```bash
   docker-compose ps
   ```

### 健康检查响应

正常响应 (HTTP 200):

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "cluster": {
    "isWorker": true,
    "workerId": 1,
    "pid": 123
  },
  "server": {
    "hostname": "container-id",
    "platform": "linux",
    "memory": {
      "total": "2048 MB",
      "free": "1024 MB",
      "used": "1024 MB",
      "usagePercent": "50%"
    }
  },
  "database": {
    "status": "connected",
    "pool": {
      "used": 2,
      "free": 8,
      "pending": 0
    }
  }
}
```

异常响应 (HTTP 503):

```json
{
  "status": "error",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "error": "数据库连接失败"
}
```

## 故障排除

### 常见问题

1. **端口冲突**

   ```bash
   # 检查端口占用
   netstat -tulpn | grep :7204

   # 修改端口映射
   # 在 docker-compose.override.yml 中修改端口
   ```

2. **数据库连接失败**

   ```bash
   # 检查数据库容器状态
   docker-compose logs database

   # 检查网络连接
   docker-compose exec backend ping database
   ```

3. **Redis 连接失败**

   ```bash
   # 检查 Redis 容器状态
   docker-compose logs redis

   # 测试 Redis 连接
   docker-compose exec backend redis-cli -h redis ping
   ```

4. **内存不足**

   ```bash
   # 检查容器资源使用
   docker stats

   # 调整内存限制
   # 在 docker-compose.override.yml 中修改 deploy.resources
   ```

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend

# 查看最近的日志
docker-compose logs --tail=100 backend
```

### 数据备份

```bash
# 备份数据库
docker-compose exec database mysqldump -u root -p syntaxseed > backup.sql

# 备份 Redis 数据
docker-compose exec redis redis-cli BGSAVE
```

## 监控和维护

### 生产环境监控

生产环境包含 Prometheus 和 Grafana 监控：

- **Prometheus**: http://127.0.0.1:9090
- **Grafana**: http://127.0.0.1:3001

### 定期维护

1. **更新镜像**

   ```bash
   docker-compose pull
   docker-compose up -d
   ```

2. **清理未使用的资源**

   ```bash
   docker system prune -f
   docker volume prune -f
   ```

3. **备份数据**
   ```bash
   # 定期备份脚本
   ./scripts/backup.sh
   ```

## 安全建议

1. **使用强密码**: 所有密码至少包含 32 个字符
2. **定期更新**: 定期更新 Docker 镜像和依赖
3. **网络隔离**: 生产环境使用内部网络
4. **访问控制**: 限制数据库和 Redis 的外部访问
5. **SSL/TLS**: 生产环境启用 HTTPS
6. **监控日志**: 定期检查应用和安全日志
7. **备份策略**: 建立定期备份和恢复流程

## 性能优化

1. **资源限制**: 根据实际需求设置内存和 CPU 限制
2. **连接池**: 优化数据库连接池配置
3. **缓存策略**: 合理配置 Redis 缓存
4. **集群模式**: 生产环境启用集群模式
5. **健康检查**: 调整健康检查间隔和超时时间
