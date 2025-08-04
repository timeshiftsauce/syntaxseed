# SyntaxSeed 博客系统后端

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)
![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-orange.svg)
![Redis](https://img.shields.io/badge/Redis-6.0+-red.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

一个功能完整的个人博客系统后端API服务

[功能特性](#功能特性) • [快速开始](#快速开始) • [API文档](#api文档) • [部署指南](#部署指南)

</div>

## 项目简介

SyntaxSeed 是一个基于 Node.js + Express.js 构建的现代化博客系统后端，提供完整的RESTful API接口。支持博客管理、用户认证、评论系统、项目展示等功能，采用集群部署架构，具备高性能和高可用性。

## 功能特性

### 🚀 核心功能

- **博客系统**: 文章发布、分类管理、标签系统、搜索功能
- **用户认证**: JWT双令牌机制、图形验证码、邮箱验证
- **评论系统**: 嵌套回复、审核机制、垃圾评论防护
- **项目展示**: 作品集展示、技术栈标签、特性描述
- **系统配置**: 网站配置管理、打字机效果、时间线

### 🛡️ 安全特性

- **认证安全**: JWT令牌、密码哈希、验证码防护
- **API保护**: 请求限流、参数验证、SQL注入防护
- **数据安全**: 敏感信息脱敏、错误信息过滤

### ⚡ 性能优化

- **集群部署**: 多进程负载均衡、进程监控重启
- **数据库优化**: 连接池管理、慢查询监控、查询优化
- **缓存策略**: Redis缓存、响应缓存头

### 📊 监控运维

- **健康检查**: 系统状态监控、数据库连接检查
- **日志系统**: 分级日志记录、错误追踪
- **性能监控**: 响应时间统计、资源使用监控

## 技术栈

| 技术       | 版本   | 用途       |
| ---------- | ------ | ---------- |
| Node.js    | 16+    | 运行时环境 |
| Express.js | 5.1.0  | Web框架    |
| MySQL      | 5.7+   | 主数据库   |
| Redis      | 6.0+   | 缓存数据库 |
| Knex.js    | 3.1.0  | 查询构建器 |
| Winston    | 3.17.0 | 日志系统   |
| JWT        | 9.0.2  | 身份认证   |
| Nodemailer | 7.0.5  | 邮件服务   |

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- MySQL >= 5.7
- Redis >= 6.0
- pnpm >= 8.0.0

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd syntaxseed-backend
```

2. **安装依赖**

```bash
pnpm install
```

3. **配置环境**

```bash
# 复制环境配置文件
cp .env.example .env

# 编辑数据库配置
vim db.config.yaml
```

4. **启动服务**

```bash
# 开发环境
pnpm dev

# 生产环境（集群模式）
pnpm run start:cluster
```

5. **验证安装**

```bash
curl http://localhost:7204/health
```

## API文档

### 基础信息

- **基础URL**: `http://localhost:7204/api`
- **认证方式**: JWT Bearer Token
- **请求格式**: JSON
- **响应格式**: JSON

### 主要端点

| 分类   | 端点             | 方法     | 描述         |
| ------ | ---------------- | -------- | ------------ |
| 系统   | `/config`        | GET      | 获取网站配置 |
| 系统   | `/health`        | GET      | 健康检查     |
| 博客   | `/blogs`         | GET      | 获取博客列表 |
| 博客   | `/blog/:id`      | GET      | 获取博客详情 |
| 博客   | `/blog/tags`     | GET      | 获取博客标签 |
| 项目   | `/projects`      | GET      | 获取项目列表 |
| 技术   | `/tech-stack`    | GET      | 获取技术栈   |
| 时间线 | `/timelines`     | GET      | 获取时间线   |
| 评论   | `/comments`      | GET/POST | 评论管理     |
| 认证   | `/auth/login`    | POST     | 用户登录     |
| 认证   | `/auth/register` | POST     | 用户注册     |

详细的API文档请查看 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 项目结构

```
├── auth/                   # 认证模块
├── config/                 # 配置管理
├── getData/                # API路由
├── middleware/             # 中间件
├── services/               # 服务层
├── logs/                   # 日志文件
├── index.js                # 应用入口
├── cluster.js              # 集群模式
├── start.js                # 启动脚本
├── db.js                   # 数据库连接
└── logger.js               # 日志配置
```

详细的项目结构说明请查看 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 部署指南

### 开发环境

```bash
# 单进程模式（推荐用于开发调试）
pnpm dev

# 集群模式
pnpm run dev:cluster
```

### 生产环境

#### 使用PM2部署

```bash
# 安装PM2
npm install -g pm2

# 启动集群
pm2 start start.js --name "syntaxseed-api" -- --cluster

# 查看状态
pm2 status

# 查看日志
pm2 logs syntaxseed-api
```

#### Docker部署

```dockerfile
FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
EXPOSE 7204

CMD ["node", "start.js", "--cluster"]
```

#### Nginx反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:7204;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 配置说明

### 环境变量配置

```bash
# 基础配置
NODE_ENV=production
PORT=7204

# 集群配置
CLUSTER_ENABLED=true
CLUSTER_WORKERS=4

# JWT配置
JWT_ACC_SECRET=your_access_secret
JWT_REF_SECRET=your_refresh_secret

# 邮件配置
MAIL_HOST=smtp.example.com
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password
```

### 数据库配置

```yaml
# db.config.yaml
db:
  client: "mysql2"
  connection:
    host: "localhost"
    user: "username"
    password: "password"
    database: "syntaxseed"
    port: 3306

redis:
  port: 6379
  host: "localhost"
  password: "redis_password"
```

## 监控和日志

### 健康检查

```bash
# 系统健康状态
curl http://localhost:7204/health

# 数据库状态
curl http://localhost:7204/db-status
```

### 日志文件

- `logs/combined.log` - 综合日志
- `logs/errors.log` - 错误日志
- `logs/exceptions.log` - 异常日志

### 性能监控

系统提供以下监控指标：

- 响应时间统计
- 数据库连接池状态
- 内存使用情况
- 集群进程状态

## 开发指南

### 添加新的API端点

```javascript
// 在 getData/index.js 中添加
router.get(
  "/new-endpoint",
  catchAsync(async (req, res) => {
    await validateDbConnection();

    const data = await db("table_name").select();

    res.status(200).json({
      data,
      code: 200,
      spendTime: Date.now() - startTime + " ms",
    });
  }),
);
```

### 数据库操作

```javascript
// 使用Knex.js进行数据库操作
const users = await db("ba_blog_user")
  .select("id", "name", "email")
  .where("status", 1)
  .limit(10);
```

### 错误处理

```javascript
const { AppError } = require("./middleware/errorHandler");

// 抛出业务错误
throw new AppError("用户不存在", 404);
```

详细的开发指南请查看 [USAGE.md](./USAGE.md)

## 安全建议

### 生产环境安全配置

- ✅ 使用强密码和复杂的JWT密钥
- ✅ 启用HTTPS
- ✅ 配置防火墙规则
- ✅ 定期更新依赖包
- ✅ 设置适当的CORS策略
- ✅ 实施请求限流
- ✅ 输入验证和参数化查询

### 数据库安全

- ✅ 使用专用数据库用户
- ✅ 限制数据库用户权限
- ✅ 启用数据库审计日志
- ✅ 定期备份数据

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查数据库服务状态
   - 验证连接配置
   - 确认网络连通性

2. **Redis连接失败**
   - 检查Redis服务状态
   - 验证密码配置
   - 确认端口开放

3. **端口被占用**
   - 使用 `lsof -i :7204` 查看占用进程
   - 修改配置文件中的端口号

### 性能优化

1. **数据库优化**
   - 添加适当的索引
   - 优化查询语句
   - 调整连接池配置

2. **缓存优化**
   - 使用Redis缓存热点数据
   - 设置合适的缓存过期时间
   - 实施缓存预热策略

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 版本历史

### v1.0.0 (2024-01-31)

- ✨ 初始版本发布
- ✨ 完整的博客系统API
- ✨ 用户认证系统
- ✨ 评论系统
- ✨ 项目展示功能
- ✨ 集群模式支持

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- **项目主页**: [SyntaxSeed](https://shiqianjiang.cn)
- **问题反馈**: [Issues](https://github.com/your-repo/issues)
- **邮箱**: blog@shiqianjiang.cn

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐**

Made with ❤️ by SyntaxSeed Team

</div>
