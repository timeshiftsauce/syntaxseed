# 项目结构和组织

## 目录结构

```
├── .kiro/                  # Kiro AI助手配置目录
├── getData/                # API路由模块目录
│   └─── index.js           # 主要API路由定义
├── node_modules/          # 依赖包目录
├── db.config.yaml         # 数据库配置文件
├── db.js                  # 数据库连接和配置加载
├── index.js               # 应用入口文件
├── package.json           # 项目配置和依赖声明
└── pnpm-lock.yaml         # pnpm锁定文件
```

## 核心文件说明

### 入口文件 (`index.js`)

- Express应用的主入口
- 配置中间件（CORS、JSON解析）
- 路由挂载到 `/api` 前缀
- 统一的404错误处理
- 服务器启动配置

### 数据库层 (`db.js`)

- 数据库连接初始化
- YAML配置文件加载
- Knex实例导出
- 错误处理和进程退出机制

### API路由层 (`getData/index.js`)

- 所有业务API端点的实现
- RESTful风格的路由设计
- 数据处理和格式化逻辑
- 错误处理和响应标准化

## 路由组织规范

### API端点结构

- 基础路径: `/api`
- 资源导向的URL设计
- 支持查询参数（分页、搜索、筛选）
- 统一的响应格式

### 主要API端点

- `GET /api/config` - 网站配置
- `GET /api/projects` - 项目列表
- `GET /api/blogs` - 博客文章列表
- `GET /api/blog/:id` - 博客详情
- `GET /api/timelines` - 时间线数据
- `GET /api/tech-stack` - 技术栈
- `GET /api/comments` - 评论系统
- `POST /api/comments` - 提交评论

## 代码组织原则

### 模块化设计

- 路由逻辑集中在 `getData` 目录
- 数据库操作通过统一的db模块
- 工具函数内联定义（如JsonToArray）

### 数据处理模式

- 数据库查询结果的标准化处理
- JSON字段的解析和转换
- 分页和计数的统一处理
- 响应时间统计

### 错误处理策略

- try-catch包装所有异步操作
- 统一的错误响应格式
- 详细的控制台错误日志
- 适当的HTTP状态码使用
