# 统一搜索引擎推送功能文档

## 概述

SyntaxSeed 博客平台集成了统一的搜索引擎推送功能，支持同时推送 URL 到百度和 Bing 搜索引擎，提高网站在各大搜索引擎中的收录速度和效果。

## 功能特性

- ✅ 同时推送到百度和 Bing 搜索引擎
- ✅ 自动推送新增 URL 到所有搜索引擎
- ✅ 支持批量推送和增量推送
- ✅ 完整的推送历史记录和统计
- ✅ 推送结果监控和错误处理
- ✅ 与 sitemap 生成功能集成
- ✅ 定期自动推送任务（一天 3 次）
- ✅ 防重复推送机制

## 支持的搜索引擎

### 1. 百度搜索引擎

- **API 地址**: `http://data.zz.baidu.com/urls`
- **每次最大推送**: 2000 个 URL
- **配置要求**: 百度搜索资源平台 Token

### 2. Bing 搜索引擎

- **API 地址**: `https://ssl.bing.com/webmaster/api.svc`
- **每次最大推送**: 500 个 URL
- **配置要求**: Bing Webmaster API Key

## 配置说明

### 1. 获取 API 密钥

#### 百度搜索引擎

1. 登录 [百度搜索资源平台](https://ziyuan.baidu.com/)
2. 添加并验证你的网站
3. 进入"普通收录" -> "API 推送"
4. 获取推送接口调用地址中的 token 参数

#### Bing 搜索引擎

1. 登录 [Bing Webmaster Tools](https://www.bing.com/webmasters/)
2. 添加并验证你的网站
3. 进入"设置" -> "API 访问"
4. 生成 API 密钥

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

# Bing搜索引擎推送配置
BING_SITE_URL=https://syntaxseed.com
BING_API_KEY=your_bing_api_key_here

# 是否启用Bing推送功能 (true/false)
ENABLE_BING_PUSH=true
```

### 3. 配置验证

运行测试命令验证配置：

```bash
pnpm search-engine:test
```

## 定时推送任务

系统会自动执行以下定时推送任务：

### 1. 每天凌晨 2 点

- 生成最新的 sitemap.xml
- 推送新增 URL 到所有搜索引擎（百度+Bing）

### 2. 每天上午 10 点

- 推送新增 URL 到所有搜索引擎（百度+Bing）

### 3. 每天下午 6 点

- 推送新增 URL 到所有搜索引擎（百度+Bing）

### 4. 每周日凌晨 3 点（可选）

- 推送所有 URL 到所有搜索引擎（谨慎使用，会消耗大量配额）

## API 接口

### 统一搜索引擎推送接口

#### 获取所有搜索引擎状态

```
GET /api/search-engine-push/status
```

响应示例：

```json
{
  "success": true,
  "data": {
    "stats": {
      "baidu": {
        "totalPushes": 10,
        "successRate": 80,
        "todayPushes": 3
      },
      "bing": {
        "totalPushes": 8,
        "successRate": 100,
        "todayPushes": 2
      }
    },
    "enginesStatus": {
      "baidu": {
        "enabled": true,
        "configured": true,
        "maxUrlsPerRequest": 2000
      },
      "bing": {
        "enabled": true,
        "configured": true,
        "maxUrlsPerRequest": 500
      }
    }
  }
}
```

#### 推送所有 URL 到所有搜索引擎

```
POST /api/search-engine-push/push-all
```

#### 推送新增 URL 到所有搜索引擎

```
POST /api/search-engine-push/push-new
```

#### 推送指定 URL 到所有搜索引擎

```
POST /api/search-engine-push/push-urls
Content-Type: application/json

{
  "urls": [
    "https://syntaxseed.com/blog/123",
    "https://syntaxseed.com/projects/456"
  ]
}
```

#### 获取所有搜索引擎推送历史

```
GET /api/search-engine-push/history?limit=20
```

#### 测试所有搜索引擎配置

```
POST /api/search-engine-push/test
```

#### 获取 Bing 推送配额

```
GET /api/search-engine-push/bing/quota
```

#### 获取搜索引擎配置状态

```
GET /api/search-engine-push/engines
```

### 单独搜索引擎接口

#### 百度推送接口

- `GET /api/baidu-push/status` - 获取百度推送状态
- `POST /api/baidu-push/push-all` - 推送所有 URL 到百度
- `POST /api/baidu-push/push-new` - 推送新增 URL 到百度

#### 定时任务管理接口

- `GET /api/scheduled-push/status` - 获取定时任务状态
- `POST /api/scheduled-push/execute/:taskName` - 手动执行任务

## 使用方法

### 1. 命令行操作

```bash
# 推送所有URL到所有搜索引擎
pnpm search-engine:push-all

# 推送新增URL到所有搜索引擎
pnpm search-engine:push-new

# 测试搜索引擎推送功能
pnpm search-engine:test

# 测试定时任务
pnpm scheduled:test
```

### 2. 自动推送

搜索引擎推送功能已集成到 sitemap 生成流程中：

- 每次生成 sitemap 时自动推送新增 URL 到所有搜索引擎
- 每天 3 次定期推送（凌晨 2 点、上午 10 点、下午 6 点）
- 新内容发布时立即推送（推荐）

### 3. 手动推送

通过 API 接口手动触发推送：

```bash
# 推送所有URL到所有搜索引擎
curl -X POST http://localhost:3000/api/search-engine-push/push-all

# 推送新增URL到所有搜索引擎
curl -X POST http://localhost:3000/api/search-engine-push/push-new

# 查看推送状态
curl http://localhost:3000/api/search-engine-push/status
```

## 推送策略

### 1. 增量推送（推荐）

- 只推送新增的 URL，避免浪费配额
- 自动记录已推送的 URL 列表
- 适合日常维护使用
- 同时推送到所有配置的搜索引擎

### 2. 全量推送

- 推送所有 URL 到所有搜索引擎
- 适合首次配置或重大更新时使用
- 会消耗较多推送配额

### 3. 定时推送

- 每天 3 次自动执行增量推送
- 与 sitemap 生成任务同步执行
- 确保新内容及时被所有搜索引擎发现

## 推送结果说明

### 成功响应示例

```json
{
  "success": true,
  "message": "成功推送到所有 2 个搜索引擎",
  "results": {
    "baidu": {
      "success": true,
      "message": "推送成功",
      "submittedCount": 10
    },
    "bing": {
      "success": true,
      "message": "推送成功",
      "submittedCount": 10
    }
  },
  "totalEngines": 2,
  "successfulEngines": 2,
  "newUrlsCount": 10
}
```

### 部分失败响应示例

```json
{
  "success": false,
  "message": "部分推送失败，成功 1/2 个搜索引擎",
  "results": {
    "baidu": {
      "success": true,
      "message": "推送成功",
      "submittedCount": 10
    },
    "bing": {
      "success": false,
      "message": "推送失败",
      "data": "API Key未配置"
    }
  },
  "totalEngines": 2,
  "successfulEngines": 1
}
```

## 监控和日志

### 1. 推送日志

日志文件位置：

- 百度推送日志：`server/logs/baidu-push.log`
- Bing 推送日志：`server/logs/bing-push.log`

### 2. 推送统计

通过 API 获取详细统计信息：

- 各搜索引擎推送次数和成功率
- 今日推送情况
- 推送 URL 数量统计
- 最后推送时间

### 3. 历史记录

保存最近的推送记录，包括：

- 推送时间和结果
- 推送的 URL 数量
- 各搜索引擎的推送状态
- 错误信息（如果有）

## 最佳实践

### 1. 推送时机

- **新内容发布时立即推送**：效果最佳
- 避免重复推送相同 URL
- 合理控制推送频率

### 2. 配额管理

- 百度和 Bing 每日推送配额有限
- 优先推送新增和重要内容
- 监控剩余配额，避免超限

### 3. 错误处理

- 定期检查推送状态和错误日志
- 及时处理配置问题
- 监控推送成功率

### 4. 性能优化

- 使用增量推送减少不必要的请求
- 并行推送到多个搜索引擎
- 设置合理的超时时间

## 故障排除

### 常见问题

1. **API 密钥配置错误**

   - 检查环境变量配置是否正确
   - 验证 API 密钥是否有效
   - 确认网站是否在对应平台验证

2. **推送失败**

   - 检查网络连接
   - 验证 URL 格式是否正确
   - 确认未超过每日配额

3. **部分搜索引擎推送失败**
   - 检查各搜索引擎的配置状态
   - 查看具体的错误信息
   - 单独测试失败的搜索引擎

### 调试命令

```bash
# 测试所有搜索引擎配置
pnpm search-engine:test

# 查看推送状态
curl http://localhost:3000/api/search-engine-push/status

# 查看推送历史
curl http://localhost:3000/api/search-engine-push/history

# 测试推送配置
curl -X POST http://localhost:3000/api/search-engine-push/test
```

## 扩展功能

可以根据需要扩展以下功能：

- 支持更多搜索引擎（Google、360、搜狗等）
- 推送结果邮件通知
- 更详细的推送分析报告
- 自定义推送规则和过滤器
- Webhook 集成
- 推送配额预警

## 安全注意事项

- 妥善保管所有搜索引擎的 API 密钥
- 不要在代码中硬编码密钥
- 定期检查推送日志，防止异常推送
- 监控推送配额使用情况
- 设置合理的推送频率限制
