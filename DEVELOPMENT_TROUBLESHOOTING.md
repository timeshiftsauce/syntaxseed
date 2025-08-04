# 开发环境故障排除指南

## 常见问题及解决方案

### 1. 前端请求 `/api/config` 返回 500 错误

#### 可能原因：

- 数据库连接失败
- 数据库未正确初始化
- 后端服务未完全启动
- 网络代理配置问题

#### 排查步骤：

1. **检查容器状态**

   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```

2. **查看后端日志**

   ```bash
   docker-compose -f docker-compose.dev.yml logs backend
   ```

3. **检查数据库日志**

   ```bash
   docker-compose -f docker-compose.dev.yml logs database
   ```

4. **测试后端健康状态**

   ```bash
   # 在宿主机上测试
   curl http://localhost:7204/api/health

   # 或使用测试脚本
   node test-backend.js
   ```

5. **测试数据库连接**

   ```bash
   # 进入后端容器
   docker-compose -f docker-compose.dev.yml exec backend sh

   # 在容器内测试数据库连接
   mysql -h database -u root -pdev_password syntaxseed_dev -e "SELECT COUNT(*) FROM ba_config;"
   ```

#### 解决方案：

1. **重启服务**

   ```bash
   docker-compose -f docker-compose.dev.yml down
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **重新构建镜像**

   ```bash
   docker-compose -f docker-compose.dev.yml down
   docker-compose -f docker-compose.dev.yml up -d --build
   ```

3. **清理并重新启动**
   ```bash
   docker-compose -f docker-compose.dev.yml down -v
   docker-compose -f docker-compose.dev.yml up -d --build
   ```

### 2. 数据库初始化问题

#### 症状：

- 后端日志显示数据库连接失败
- 查询 `ba_config` 表时出错

#### 解决方案：

1. **检查数据库是否正确初始化**

   ```bash
   docker-compose -f docker-compose.dev.yml exec database mysql -u root -pdev_password syntaxseed_dev -e "SHOW TABLES;"
   ```

2. **手动导入数据库**

   ```bash
   docker-compose -f docker-compose.dev.yml exec -T database mysql -u root -pdev_password syntaxseed_dev < syntaxseed.sql
   ```

3. **重新创建数据库容器**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   docker volume rm syntaxseed-blog_mysql_dev_data
   docker-compose -f docker-compose.dev.yml up -d database
   # 等待数据库启动完成
   sleep 30
   docker-compose -f docker-compose.dev.yml up -d
   ```

### 3. 网络代理问题

#### 症状：

- 前端无法访问后端 API
- 浏览器控制台显示网络错误

#### 解决方案：

1. **检查 Vite 代理配置**

   - 确保 `client/vite.config.ts` 中的代理配置正确
   - 检查环境变量 `VITE_DEV_PROXY_TARGET` 是否正确设置

2. **验证容器间网络连接**

   ```bash
   # 进入前端容器
   docker-compose -f docker-compose.dev.yml exec frontend sh

   # 测试是否能访问后端
   wget -qO- http://backend:7204/api/health
   ```

3. **检查端口映射**
   ```bash
   docker-compose -f docker-compose.dev.yml port backend 7204
   docker-compose -f docker-compose.dev.yml port frontend 3000
   ```

### 4. 环境变量问题

#### 症状：

- 配置验证失败
- JWT 密钥长度不足错误

#### 解决方案：

1. **检查环境变量**

   ```bash
   docker-compose -f docker-compose.dev.yml exec backend env | grep -E "(JWT|SESSION|DB|REDIS)"
   ```

2. **验证配置**
   ```bash
   docker-compose -f docker-compose.dev.yml exec backend node -e "
   const { config } = require('./config/env');
   console.log('Config loaded successfully:', Object.keys(config));
   "
   ```

### 5. 权限问题

#### 症状：

- 容器无法写入日志文件
- 文件挂载权限错误

#### 解决方案：

1. **修复文件权限**

   ```bash
   # 在宿主机上
   sudo chown -R $USER:$USER ./server/logs
   sudo chown -R $USER:$USER ./client/node_modules
   ```

2. **重新创建容器**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   docker-compose -f docker-compose.dev.yml up -d --force-recreate
   ```

## 调试技巧

### 1. 实时查看日志

```bash
# 查看所有服务日志
docker-compose -f docker-compose.dev.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f database
```

### 2. 进入容器调试

```bash
# 进入后端容器
docker-compose -f docker-compose.dev.yml exec backend sh

# 进入前端容器
docker-compose -f docker-compose.dev.yml exec frontend sh

# 进入数据库容器
docker-compose -f docker-compose.dev.yml exec database mysql -u root -pdev_password syntaxseed_dev
```

### 3. 网络调试

```bash
# 查看网络配置
docker network ls
docker network inspect syntaxseed-blog_default

# 测试容器间连接
docker-compose -f docker-compose.dev.yml exec frontend ping backend
docker-compose -f docker-compose.dev.yml exec backend ping database
```

### 4. 性能监控

```bash
# 查看容器资源使用
docker stats

# 查看容器详细信息
docker-compose -f docker-compose.dev.yml exec backend ps aux
```

## 完整重置流程

如果遇到无法解决的问题，可以执行完整重置：

```bash
# 1. 停止所有服务
docker-compose -f docker-compose.dev.yml down

# 2. 删除所有相关容器和卷
docker-compose -f docker-compose.dev.yml down -v --remove-orphans

# 3. 清理 Docker 系统（可选）
docker system prune -f

# 4. 重新构建和启动
docker-compose -f docker-compose.dev.yml up -d --build

# 5. 等待服务启动完成
sleep 60

# 6. 测试服务
node test-backend.js
```

## 联系支持

如果问题仍然存在，请提供以下信息：

1. 错误日志：`docker-compose -f docker-compose.dev.yml logs`
2. 容器状态：`docker-compose -f docker-compose.dev.yml ps`
3. 系统信息：`docker version` 和 `docker-compose version`
4. 具体的错误步骤和预期结果
