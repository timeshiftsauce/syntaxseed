# SyntaxSeed 博客系统 API 接口文档

## 项目概述

SyntaxSeed 是一个个人作品集和博客系统的后端API服务，提供完整的RESTful API接口，支持个人网站的各种功能模块。

### 技术栈

- **运行时**: Node.js
- **Web框架**: Express.js v5.1.0
- **数据库**: MySQL 2 (通过mysql2驱动)
- **ORM**: Knex.js v3.1.0 (查询构建器)
- **缓存**: Redis (ioredis)
- **配置管理**: YAML (js-yaml)
- **包管理器**: pnpm v10.13.1

### 服务器信息

- **默认端口**: 7204
- **基础路径**: `/api`
- **支持CORS**: 是
- **请求格式**: JSON
- **响应格式**: JSON

## 通用响应格式

### 成功响应

```json
{
  "code": 200,
  "data": {},
  "total": 0,
  "spendTime": "10 ms"
}
```

### 错误响应

```json
{
  "success": false,
  "code": 400,
  "message": "错误信息"
}
```

## 认证机制

### JWT Token 认证

- **Access Token**: 用于API访问，有效期5分钟
- **Refresh Token**: 用于刷新访问令牌，有效期10天
- **请求头格式**: `Authorization: Bearer <token>`

### 图形验证码

- 用于注册、登录等敏感操作
- 有效期2分钟
- SVG格式，5位字符

### 邮箱验证码

- 用于注册验证
- 6位数字验证码
- 有效期5分钟

## API 接口详情

### 1. 系统配置接口

#### 1.1 获取网站配置

```http
GET /api/config
```

**响应示例**:

```json
{
  "minTitle": "SyntaxSeed",
  "title": "时迁酱的博客",
  "link": "https://shiqianjiang.cn",
  "upload_cdn_url": "https://cdn.example.com",
  "record_number": "ICP备案号",
  "Introduction": "个人介绍"
}
```

#### 1.2 获取打字机文本

```http
GET /api/typewriter-texts
```

**响应示例**:

```json
{
  "data": ["欢迎来到我的博客", "分享技术与生活"],
  "total": 2,
  "code": 200
}
```

### 2. 项目展示接口

#### 2.1 获取项目列表

```http
GET /api/projects
```

**查询参数**:

- `limit` (number, optional): 每页数量，默认100，最大500
- `page` (number, optional): 页码，默认1

**响应示例**:

```json
{
  "data": [
    {
      "id": 1,
      "title": "项目标题",
      "description": "项目描述",
      "tags": ["React", "Node.js"],
      "images": ["image1.jpg", "image2.jpg"],
      "image": "image1.jpg",
      "features": ["特性1", "特性2"],
      "techStack": ["技术1", "技术2"],
      "weigh": 100
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 100,
  "code": 200,
  "spendTime": "15 ms"
}
```

### 3. 博客系统接口

#### 3.1 获取博客列表

```http
GET /api/blogs
```

**查询参数**:

- `limit` (number, optional): 每页数量，默认100，最大500
- `page` (number, optional): 页码，默认1
- `keywords` (string, optional): 搜索关键词

**响应示例**:

```json
{
  "data": [
    {
      "id": "1",
      "title": "博客标题",
      "create_time": "2024-01-01 12:00:00",
      "readTime": "5分钟",
      "tags": ["JavaScript", "前端"],
      "image": "cover.jpg",
      "excerpt": "文章摘要"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "keywords": "",
  "code": 200,
  "spendTime": "20 ms"
}
```

#### 3.2 获取博客详情

```http
GET /api/blog/:id
```

**路径参数**:

- `id` (string, required): 博客ID

**响应示例**:

```json
{
  "id": "1",
  "title": "博客标题",
  "content": "博客内容",
  "create_time": "2024-01-01 12:00:00",
  "readTime": "5分钟",
  "tags": ["JavaScript", "前端"],
  "image": "cover.jpg",
  "prevPost": {
    "id": "2",
    "title": "上一篇文章"
  },
  "nextPost": {
    "id": "3",
    "title": "下一篇文章"
  },
  "code": 200,
  "spendTime": "25 ms"
}
```

#### 3.3 获取博客标签

```http
GET /api/blog/tags
```

**响应示例**:

```json
{
  "tags": ["JavaScript", "React", "Node.js", "前端", "后端"],
  "total": 5,
  "code": 200,
  "spendTime": "10 ms"
}
```

### 4. 技术栈接口

#### 4.1 获取技术栈

```http
GET /api/tech-stack
```

**响应示例**:

```json
{
  "data": [
    {
      "id": 1,
      "name": "JavaScript",
      "level": 90,
      "category": "前端",
      "icon": "js-icon.svg",
      "status": 1
    }
  ],
  "code": 200,
  "spendTime": "12 ms"
}
```

### 5. 时间线接口

#### 5.1 获取时间线

```http
GET /api/timelines
```

**响应示例**:

```json
{
  "data": [
    {
      "id": 1,
      "year": 2024,
      "title": "里程碑标题",
      "description": "详细描述",
      "date": "2024-01-01",
      "technologies": ["React", "Node.js"],
      "skills": [
        {
          "name": "JavaScript",
          "level": 85
        }
      ]
    }
  ],
  "total": 5,
  "code": 200,
  "spendTime": "18 ms"
}
```

### 6. 评论系统接口

#### 6.1 获取评论列表

```http
GET /api/comments
```

**查询参数**:

- `blog_id` (string, optional): 博客ID，筛选特定博客的评论
- `limit` (number, optional): 每页数量，默认10，最大100
- `page` (number, optional): 页码，默认1

**响应示例**:

```json
{
  "data": [
    {
      "id": "1",
      "blog_id": "1",
      "author": "评论者",
      "content": "评论内容",
      "create_time": 1704067200,
      "avatar": null,
      "website": "https://example.com",
      "parent_id": null
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 10,
  "code": 200,
  "spendTime": "30 ms"
}
```

#### 6.2 提交评论

```http
POST /api/comments
```

**请求体**:

```json
{
  "blog_id": "1",
  "author": "评论者姓名",
  "content": "评论内容",
  "email": "user@example.com",
  "website": "https://example.com",
  "parent_id": null
}
```

**限流**: 每个IP每5分钟最多10次请求

**响应示例**:

```json
{
  "message": "评论提交成功，等待审核",
  "data": {
    "id": "123",
    "blog_id": "1",
    "author": "评论者姓名",
    "content": "评论内容",
    "create_time": 1704067200,
    "status": "0"
  },
  "code": 201,
  "spendTime": "45 ms"
}
```

#### 6.3 获取评论数量

```http
GET /api/comments/count/:blogId
```

**路径参数**:

- `blogId` (string, required): 博客ID

**响应示例**:

```json
{
  "blog_id": "1",
  "count": 15,
  "code": 200,
  "spendTime": "8 ms"
}
```

### 7. 认证系统接口

#### 7.1 获取图形验证码

```http
GET /api/auth/captcha
```

**响应示例**:

```json
{
  "id": "captcha_hash_id",
  "captcha": "base64_encoded_svg"
}
```

#### 7.2 发送邮箱验证码

```http
POST /api/auth/send-email-code
```

**请求体**:

```json
{
  "email": "user@example.com",
  "captchaId": "captcha_hash_id",
  "captchaCode": "12345",
  "type": "register"
}
```

**响应示例**:

```json
{
  "success": true,
  "code": 200,
  "message": "验证码已发送到您的邮箱，请查收"
}
```

#### 7.3 用户注册

```http
POST /api/auth/register
```

**请求体**:

```json
{
  "username": "用户名",
  "password": "密码",
  "email": "user@example.com",
  "emailCode": "123456",
  "login": false
}
```

**密码要求**: 8-16位，包含数字、字母或特殊符号

**响应示例**:

```json
{
  "success": true,
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": 123
  }
}
```

#### 7.4 用户登录

```http
POST /api/auth/login
```

**请求体**:

```json
{
  "email": "user@example.com",
  "password": "密码",
  "captchaCode": "12345",
  "captchaId": "captcha_hash_id"
}
```

**响应示例**:

```json
{
  "success": true,
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 123,
      "name": "用户名",
      "email": "user@example.com"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### 7.5 刷新令牌

```http
POST /api/auth/refresh-token
```

**请求头**:

```
Authorization: Bearer <refresh_token>
```

**响应示例**:

```json
{
  "success": true,
  "code": 200,
  "message": "刷新成功",
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
}
```

#### 7.6 用户登出

```http
POST /api/auth/logout
```

**请求体**:

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**响应示例**:

```json
{
  "success": true,
  "code": 200,
  "message": "登出成功"
}
```

#### 7.7 获取用户信息 🔒

```http
GET /api/auth/user-info
```

**需要认证**: 是

**响应示例**:

```json
{
  "success": true,
  "code": 200,
  "message": "获取用户信息成功",
  "data": {
    "id": 123,
    "name": "用户名",
    "email": "user@example.com",
    "phone": "13800138000",
    "registTime": 1704067200,
    "status": 1
  }
}
```

#### 7.8 更新用户信息 🔒

```http
PUT /api/auth/user-info
```

**需要认证**: 是

**请求体**:

```json
{
  "name": "新用户名",
  "phone": "13800138000"
}
```

**响应示例**:

```json
{
  "success": true,
  "code": 200,
  "message": "更新用户信息成功",
  "data": {
    "id": 123,
    "name": "新用户名",
    "email": "user@example.com",
    "phone": "13800138000"
  }
}
```

### 8. 管理员接口 🔒

#### 8.1 审核评论

```http
PUT /api/admin/comments/:id/status
```

**需要认证**: 是（管理员权限）

**路径参数**:

- `id` (string, required): 评论ID

**请求体**:

```json
{
  "status": "1"
}
```

**状态值**:

- `"0"`: 待审核
- `"1"`: 已通过

**响应示例**:

```json
{
  "message": "评论已审核通过",
  "code": 200,
  "spendTime": "12 ms"
}
```

#### 8.2 删除评论

```http
DELETE /api/admin/comments/:id
```

**需要认证**: 是（管理员权限）

**路径参数**:

- `id` (string, required): 评论ID

**响应示例**:

```json
{
  "message": "评论已删除",
  "code": 200,
  "spendTime": "15 ms"
}
```

### 9. 系统监控接口

#### 9.1 健康检查

```http
GET /health
```

**响应示例**:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "cluster": {
    "isWorker": true,
    "workerId": 1,
    "pid": 12345
  },
  "server": {
    "hostname": "server-name",
    "platform": "linux",
    "arch": "x64",
    "cpus": 4,
    "memory": {
      "total": "8192 MB",
      "free": "4096 MB",
      "used": "4096 MB",
      "usagePercent": "50%"
    }
  },
  "process": {
    "pid": 12345,
    "uptime": 3600,
    "memoryUsage": {
      "rss": "128 MB",
      "heapTotal": "64 MB",
      "heapUsed": "32 MB"
    }
  },
  "database": {
    "status": "connected",
    "pool": {
      "total": 10,
      "active": 2,
      "idle": 8,
      "pending": 0
    }
  }
}
```

#### 9.2 数据库状态

```http
GET /db-status
```

**响应示例**:

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": {
    "pool": {
      "total": 10,
      "active": 2,
      "idle": 8,
      "pending": 0,
      "timeouts": 0
    }
  }
}
```

## 错误码说明

| 状态码 | 说明               |
| ------ | ------------------ |
| 200    | 请求成功           |
| 201    | 创建成功           |
| 400    | 请求参数错误       |
| 401    | 未授权，需要登录   |
| 403    | 禁止访问，权限不足 |
| 404    | 资源不存在         |
| 408    | 请求超时           |
| 429    | 请求过于频繁       |
| 500    | 服务器内部错误     |
| 503    | 服务不可用         |

## 限流策略

| 接口类型 | 限制     | 时间窗口 |
| -------- | -------- | -------- |
| 全局接口 | 120次/IP | 1分钟    |
| API接口  | 90次/IP  | 1分钟    |
| 评论提交 | 10次/IP  | 5分钟    |
| 管理接口 | 30次/IP  | 1分钟    |

## 数据库表结构

### 主要数据表

- `ba_config`: 网站配置
- `ba_typewritertexts`: 打字机文本
- `ba_project`: 项目信息
- `ba_blogdetail`: 博客文章
- `ba_timeline`: 时间线
- `ba_tech_stack`: 技术栈
- `ba_comments`: 评论系统
- `ba_blog_user`: 用户信息

## 部署说明

### 环境要求

- Node.js >= 16.0.0
- MySQL >= 5.7
- Redis >= 6.0
- pnpm >= 8.0.0

### 启动命令

```bash
# 开发环境
pnpm dev

# 生产环境（单进程）
pnpm start

# 生产环境（集群模式）
pnpm run start:cluster
```

### 环境变量配置

参考 `.env` 文件配置相关环境变量，包括数据库连接、JWT密钥、邮件服务等。

## 更新日志

### v1.0.0 (2024-01-01)

- 初始版本发布
- 完整的博客系统API
- 用户认证系统
- 评论系统
- 项目展示功能
- 集群模式支持

---

**文档版本**: v1.0.0  
**最后更新**: 2024-01-31  
**维护者**: SyntaxSeed Team
