# 技术栈和构建系统

## 核心技术栈

- **运行时**: Node.js
- **Web框架**: Express.js v5.1.0
- **数据库**: MySQL 2 (通过mysql2驱动)
- **ORM**: Knex.js v3.1.0 (查询构建器)
- **配置管理**: YAML (js-yaml)
- **包管理器**: pnpm v10.13.1

## 主要依赖

- **cors**: 跨域资源共享支持
- **express**: Web应用框架
- **knex**: SQL查询构建器和数据库迁移工具
- **mysql2**: MySQL数据库驱动
- **js-yaml**: YAML文件解析
- **path-to-regexp**: 路径匹配工具
- **nodemon**: 开发环境自动重启工具

## 常用命令

```bash
# 开发环境启动 (自动重启)
npm run dev
# 或
pnpm dev

# 生产环境启动
node index.js

# 安装依赖
pnpm install
```

## 数据库配置

- 数据库配置通过 `db.config.yaml` 文件管理
- 使用 Knex.js 作为查询构建器，支持原生SQL和构建器语法
- 数据库连接配置包含主机、用户名、密码、数据库名和端口

## 开发工具

- **nodemon**: 开发环境下文件变更自动重启服务
- **pnpm**: 高效的包管理器，支持工作区和依赖去重

## 服务配置

- 默认端口: 7204
- 支持CORS跨域请求
- JSON请求体解析
- 统一的404错误处理（中文提示）
