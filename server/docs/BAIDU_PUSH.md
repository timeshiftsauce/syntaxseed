# 百度搜索引擎推送功能文档

## 概述

SyntaxSeed 博客平台集成了百度搜索引擎 API 推送功能，可以自动将网站 URL 推送到百度搜索引擎，提高网站在百度搜索中的收录速度和效果。

## 功能特性

- ✅ 自动推送新增 URL 到百度搜索引擎
- ✅ 支持批量推送和增量推送
- ✅ 完整的推送历史记录和统计
- ✅ 推送结果监控和错误处理
- ✅ 与 sitemap 生成功能集成
- ✅ 定期自动推送任务
- ✅ 防重复推送机制

## 配置说明

### 1. 获取百度推送 Token

1. 登录 [百度搜索资源平台](https://ziyuan.baidu.com/)
2. 添加并验证你的网站
3. 进入"普通收录" -> "API 推送"
4. 获取推送接口调用地址中的 token 参数

### 2. 环境变量配置

在 `.env` 文件中添加以下配置：

```bash
# 网站基础URL
BASE_URL=https://syntaxseed.com

# 百度搜索引擎推送配置
BAIDU_SITE=syntaxseed.com
BAIDU_TOKEN=your_16_character_token

# 是否启用百度推送功能 (true/false)
ENABLE_BAIDU_PUSH=true
```

### 3. 配置验证

运行测试命令验证配置：

```bash
pnpm baidu:test
```

## API 接口

### 公共接口

#### 获取推送状态

```
GET /api/baidu-push/status
```

响应示例：

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalPushes": 5,
      "todayPushes": 2,
      "successfulPushes": 4,
      "failedPushes": 1,
      "totalUrlsPushed": 150,
      "todayUrlsPushed": 31,
      "successRate": 80,
      "lastPushTime": "2025-08-06T02:30:00.000Z"
    },
    "recentHistory": [...],
    "configuration": {
      "site": "syntaxseed.com",
      "tokenConfigured": true,
      "maxUrlsPerRequest": 2000
    }
  }
}
```

#### 推送所有 URL

```
POST /api/baidu-push/push-all
```

#### 推送新增 URL

```
POST /api/baidu-push/push-new
```

#### 推送指定 URL 列表

```
POST /api/baidu-push/push-urls
Content-Type: application/json

{
  "urls": [
    "https://syntaxseed.com/blog/123",
    "https://syntaxseed.com/projects/456"
  ]
}
```

#### 获取推送历史

```
GET /api/baidu-push/history?limit=50
```

#### 获取网站所有 URL

```
GET /api/baidu-push/urls
```

#### 测试推送配置

```
POST /api/baidu-push/test
```

## 使用方法

### 1. 命令行操作

```bash
# 推送所有URL
pnpm baidu:push-all

# 推送新增URL
pnpm baidu:push-new

# 测试百度推送功能
pnpm baidu:test
```

### 2. 自动推送

百度推送功能已集成到 sitemap 生成流程中：

- 每次生成 sitemap 时自动推送新增 URL
- 每天凌晨 2 点定期推送
- 新内容发布时立即推送（推荐）

### 3. 手动推送

通过 API 接口手动触发推送：

```bash
# 推送所有URL
curl -X POST http://localhost:3000/api/baidu-push/push-all

# 推送新增URL
curl -X POST http://localhost:3000/api/baidu-push/push-new

# 查看推送状态
curl http://localhost:3000/api/baidu-push/status
```

## 推送策略

### 1. 增量推送（推荐）

- 只推送新增的 URL，避免浪费配额
- 自动记录已推送的 URL 列表
- 适合日常维护使用

### 2. 全量推送

- 推送所有 URL 到百度搜索引擎
- 适合首次配置或重大更新时使用
- 会消耗较多推送配额

### 3. 定时推送

- 每天凌晨 2 点自动执行增量推送
- 与 sitemap 生成任务同步执行
- 确保新内容及时被搜索引擎发现

## 推送结果说明

### 成功响应 (HTTP 200)

```json
{
  "remain": 4999998,
  "success": 2,
  "not_same_site": [],
  "not_valid": []
}
```

字段说明：

- `success`: 成功推送的 URL 条数
- `remain`: 当天剩余的可推送 URL 条数
- `not_same_site`: 非本站 URL 列表
- `not_valid`: 不合法的 URL 列表

### 错误响应 (HTTP 4XX/5XX)

```json
{
  "error": 400,
  "message": "site error"
}
```

常见错误：

- `400 site error`: 站点未在搜索资源平台验证
- `400 empty content`: 推送内容为空
- `400 only 2000 urls are allowed once`: 每次最多 2000 条链接
- `400 over quota`: 超过每日配额
- `401 token is not valid`: Token 错误
- `404 not found`: 接口地址错误
- `500 internal error`: 服务器异常

## 监控和日志

### 1. 推送日志

日志文件位置：`server/logs/baidu-push.log`

日志格式：

```json
{
  "timestamp": "2025-08-06T02:30:00.000Z",
  "success": true,
  "urlCount": 31,
  "statusCode": 200,
  "data": {...},
  "urls": [...]
}
```

### 2. 推送统计

通过 API 获取详细统计信息：

- 总推送次数和成功率
- 今日推送情况
- 推送 URL 数量统计
- 最后推送时间

### 3. 历史记录

保存最近的推送记录，包括：

- 推送时间和结果
- 推送的 URL 数量
- 错误信息（如果有）

## 最佳实践

### 1. 推送时机

- **新内容发布时立即推送**：效果最佳
- 避免重复推送相同 URL
- 合理控制推送频率

### 2. 配额管理

- 百度每日推送配额有限
- 优先推送新增和重要内容
- 监控剩余配额，避免超限

### 3. 错误处理

- 定期检查推送状态和错误日志
- 及时处理配置问题
- 监控推送成功率

### 4. 性能优化

- 使用增量推送减少不必要的请求
- 批量处理大量 URL
- 设置合理的超时时间

## 故障排除

### 常见问题

1. **Token 配置错误**

   - 检查环境变量 `BAIDU_TOKEN` 是否正确
   - 确认 Token 是 16 位字符串
   - 验证站点是否在百度搜索资源平台验证

2. **推送失败**

   - 检查网络连接
   - 验证 URL 格式是否正确
   - 确认未超过每日配额

3. **配额不足**
   - 检查当日推送量
   - 优化推送策略，只推送新增 URL
   - 联系百度申请提高配额

### 调试命令

```bash
# 测试配置
pnpm baidu:test

# 查看推送状态
curl http://localhost:3000/api/baidu-push/status

# 查看推送历史
curl http://localhost:3000/api/baidu-push/history

# 测试推送配置
curl -X POST http://localhost:3000/api/baidu-push/test
```

## 扩展功能

可以根据需要扩展以下功能：

- 支持其他搜索引擎推送（Google、Bing 等）
- 推送结果邮件通知
- 更详细的推送分析报告
- 自定义推送规则和过滤器
- Webhook 集成

## 安全注意事项

- 妥善保管百度推送 Token
- 不要在代码中硬编码 Token
- 定期检查推送日志，防止异常推送
- 监控推送配额使用情况
