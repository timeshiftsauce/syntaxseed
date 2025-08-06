# Sitemap 服务文档

## 概述

SyntaxSeed 博客平台的 sitemap 自动生成服务，支持定期生成和手动触发生成 sitemap.xml 文件。

## 功能特性

- ✅ 自动包含静态页面（首页、关于、项目、博客、时间线）
- ✅ 动态获取博客文章、项目和分类页面
- ✅ 定期自动生成（每天凌晨 2 点）
- ✅ 手动触发生成
- ✅ 状态监控和管理接口
- ✅ 防重复生成机制
- ✅ 符合 sitemap.xml 标准格式

## 文件结构

```
server/
├── services/
│   └── sitemapService.js      # 核心sitemap服务
├── getData/
│   ├── sitemap.js             # 公共API接口
│   └── admin/
│       └── sitemap.js         # 管理员接口
├── scripts/
│   └── initSitemap.js         # 初始化脚本
├── public/
│   └── sitemap.xml            # 生成的sitemap文件
└── docs/
    └── SITEMAP.md             # 本文档
```

## API 接口

### 公共接口

#### 获取 sitemap 状态

```
GET /api/sitemap/status
```

响应示例：

```json
{
  "success": true,
  "data": {
    "exists": true,
    "lastGenerated": "2025-08-05T15:30:00.000Z",
    "size": 2048,
    "path": "/path/to/sitemap.xml"
  }
}
```

#### 手动生成 sitemap

```
POST /api/sitemap/generate
```

#### 获取 sitemap XML 内容

```
GET /api/sitemap/xml
```

### 管理员接口

#### 获取详细状态

```
GET /api/admin/sitemap/status
```

#### 预览 sitemap 内容

```
GET /api/admin/sitemap/preview
```

#### 获取配置信息

```
GET /api/admin/sitemap/config
```

## 配置说明

### 环境变量

- `BASE_URL`: 网站基础 URL（默认：https://syntaxseed.com）

### 定时任务

- 执行时间：每天凌晨 2 点（Asia/Shanghai 时区）
- 使用 node-cron 库实现
- 防重复生成机制

### 数据库表依赖

服务需要以下数据库表：

1. `blog_posts` - 博客文章

   - 字段：slug, created_at, updated_at, status
   - 条件：status = 'published'

2. `projects` - 项目

   - 字段：slug, created_at, updated_at, status
   - 条件：status = 'published'

3. `categories` - 分类
   - 字段：slug, status
   - 条件：status = 'active'

## 使用方法

### 1. 安装依赖

```bash
cd server
pnpm install node-cron
```

### 2. 启动服务

服务会在服务器启动时自动初始化：

- `http://localhost:3000/sitemap.xml`
- `https://yourdomain.com/sitemap.xml`

### 4. 手动生成

通过 API 手动触发生成：

```bash
curl -X POST http://localhost:3000/api/sitemap/generate
```

### 5. 查看状态

```bash
curl http://localhost:3000/api/sitemap/status
```

## 生成的 sitemap 结构

````xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://syntaxseed.com/</loc>
    <lastmod>2025-08-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://syntaxseed.com/blog/my-first-post</loc>
    <lastmod>2025-08-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- 更多URL... -->
</urlset>
```

## 优先级和更新频率

| 页面类型 | 优先级 | 更新频率 |
|---------|--------|----------|
| 首页 | 1.0 | daily |
| 博客列表 | 0.9 | daily |
| 项目列表 | 0.9 | weekly |
| 博客文章 | 0.8 | monthly |
| 关于页面 | 0.8 | monthly |
| 项目详情 | 0.7 | monthly |
| 时间线 | 0.7 | monthly |
| 分类页面 | 0.6 | weekly |

## 监控和日志

### 日志输出

服务会输出以下日志信息：
- 定时任务执行状态
- 生成成功/失败信息
- URL统计信息
- 错误详情

### 状态监控

可通过管理接口监控：
- 文件是否存在
- 最后生成时间
- 文件大小
- URL数量统计

## 故障排除

### 常见问题

1. **sitemap.xml不存在**
   - 检查public目录权限
   - 查看服务器日志
   - 手动触发生成

2. **定时任务不执行**
   - 确认服务器时区设置
   - 检查node-cron依赖
   - 查看进程日志

3. **数据库连接错误**
   - 检查数据库配置
   - 确认表结构正确
   - 验证数据库权限

### 调试命令

```bash
# 查看生成状态
curl http://localhost:3000/api/sitemap/status

# 手动生成并查看结果
curl -X POST http://localhost:3000/api/sitemap/generate

# 预览sitemap内容
curl http://localhost:3000/api/admin/sitemap/preview
```

## 性能优化

- 使用防重复生成机制
- 异步执行，不阻塞服务器启动
- 只在主进程中运行定时任务
- 合理的数据库查询优化

## 扩展功能

可以根据需要扩展以下功能：
- 支持多语言sitemap
- 图片sitemap生成
- 新闻sitemap支持
- 自定义更新频率配置
- Webhook通知机制
```bash
pnpm dev
# 或
pnpm start
````

### 3. 访问 sitemap

生成的 sitemap 可通过以下 URL 访问：
