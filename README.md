# SyntaxSeed - 开发者成长日志平台

> 一个专为开发者设计的极简主义高端技术博客平台，用于展示开发历程和技术分析

![SyntaxSeed](https://img.shields.io/badge/SyntaxSeed-v1.0.0-blue)
![Vue](https://img.shields.io/badge/Vue-3.5+-green)
![Node.js](https://img.shields.io/badge/Node.js-Express-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/License-ISC-yellow)

## 📖 项目简介

SyntaxSeed 是一个面向高中生开发者和年轻程序员的技术博客平台，旨在为他们提供一个记录和分享技术成长历程的专业空间。平台采用现代化的全栈技术架构，结合优雅的海洋蓝主题设计，为用户提供沉浸式的技术写作和阅读体验。

### 核心理念

- **成长记录**：为开发者提供完整的技术成长轨迹记录
- **知识分享**：构建高质量的技术内容分享社区
- **视觉体验**：通过精心设计的 UI/UX 提升用户体验
- **技术展示**：全面展示开发者的技术栈和项目作品

## ✨ 核心功能

### 📝 内容管理

- **技术博客系统**：支持 Markdown 编写，代码高亮显示
- **文章分类管理**：多维度分类和标签系统
- **草稿箱功能**：支持文章草稿保存和编辑
- **SEO 优化**：自动生成 SEO 友好的 URL 和元数据

### 🎨 用户体验

- **响应式设计**：完美适配桌面端、平板和移动设备
- **主题切换**：支持明暗主题无缝切换
- **动效交互**：3D 卡片翻转效果和波浪背景动画
- **个性化定制**：用户可自定义主题色彩和布局

### 🚀 项目展示

- **作品集管理**：展示个人项目和开源贡献
- **技术栈展示**：可视化技术能力雷达图
- **项目筛选**：按技术栈、类型、时间等维度筛选
- **在线预览**：支持项目在线演示和代码查看

### 📊 成长追踪

- **学习时间线**：可视化技术学习历程
- **技能进度**：跟踪各项技术技能的掌握程度
- **成就系统**：里程碑式的成长记录
- **数据统计**：文章阅读量、项目 star 数等数据分析

## 🎨 设计理念

### 视觉风格

- **主题定位**：开发者成长日志 × 技术分析博客
- **设计语言**：动态海洋蓝 × 极简科技美学 × 微交互动画
- **用户体验**：专注内容，减少干扰，提升阅读体验

### 色彩方案

```css
/* 浅色主题 */
--primary-light: #f0f7ff; /* 浅天蓝色 */
--background-light: #ffffff; /* 纯白背景 */
--text-light: #2d3748; /* 深灰文字 */

/* 深色主题 */
--primary-dark: #0a192f; /* 深海蓝色 */
--background-dark: #1a202c; /* 深灰背景 */
--text-dark: #e2e8f0; /* 浅灰文字 */

/* 强调色 */
--accent: #2a9d8f; /* 海洋青绿 */
--highlight: #64ffda; /* 霓虹青色 */
--warning: #f6ad55; /* 温暖橙色 */
--success: #68d391; /* 成功绿色 */
```

## 🏗️ 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        SyntaxSeed 平台                        │
├─────────────────────────────────────────────────────────────┤
│  前端应用 (Vue 3 + TypeScript)                               │
│  ├── 用户界面层 (UI Components)                              │
│  ├── 状态管理层 (Pinia Store)                               │
│  ├── 路由管理层 (Vue Router)                                │
│  └── 工具函数层 (Utils & Composables)                       │
├─────────────────────────────────────────────────────────────┤
│  后端服务 (Node.js + Express)                               │
│  ├── 控制器层 (Controllers)                                 │
│  ├── 服务层 (Services)                                      │
│  ├── 中间件层 (Middleware)                                  │
│  └── 数据访问层 (Data Access)                               │
├─────────────────────────────────────────────────────────────┤
│  管理后台 (BuildAdmin)                                       │
│  ├── 内容管理 (CMS)                                         │
│  ├── 用户管理 (User Management)                             │
│  ├── 系统监控 (System Monitor)                              │
│  └── 数据分析 (Analytics)                                   │
├─────────────────────────────────────────────────────────────┤
│  数据存储层                                                  │
│  ├── MySQL 8.0 (主数据库)                                   │
│  ├── Redis 7.0 (缓存 & 会话)                               │
│  └── 文件存储 (静态资源)                                     │
└─────────────────────────────────────────────────────────────┘
```

### 目录结构

```
SyntaxSeed/
├── client/                    # 前端应用
│   ├── src/
│   │   ├── assets/           # 静态资源
│   │   ├── components/       # 可复用组件
│   │   │   ├── common/       # 通用组件
│   │   │   ├── layout/       # 布局组件
│   │   │   └── business/     # 业务组件
│   │   ├── composables/      # 组合式函数
│   │   ├── router/           # 路由配置
│   │   ├── stores/           # 状态管理
│   │   ├── styles/           # 样式文件
│   │   ├── utils/            # 工具函数
│   │   ├── views/            # 页面组件
│   │   ├── types/            # TypeScript 类型定义
│   │   └── main.ts           # 应用入口
│   ├── public/               # 公共静态资源
│   └── dist/                 # 构建输出
├── server/                   # 后端服务
│   ├── auth/                 # 认证相关
│   ├── config/               # 配置文件
│   ├── controllers/          # 控制器
│   ├── middleware/           # 中间件
│   ├── models/               # 数据模型
│   ├── routes/               # 路由定义
│   ├── services/             # 业务服务
│   ├── utils/                # 工具函数
│   ├── logs/                 # 日志文件
│   └── index.js              # 服务入口
├── dashboard/                # 管理后台
│   ├── app/                  # 应用代码
│   ├── config/               # 配置文件
│   ├── public/               # 公共资源
│   └── web/                  # 前端构建
├── docs/                     # 项目文档
├── scripts/                  # 构建脚本
└── docker/                   # Docker 配置
```

## 🛠️ 技术栈详解

### 前端技术栈 (Client)

#### 核心框架

- **Vue 3.5+**：采用 Composition API，提供更好的类型推导和代码组织
- **TypeScript 5.0+**：静态类型检查，提升代码质量和开发效率
- **Vite 6.0+**：极速的构建工具，支持热模块替换和优化的生产构建

#### UI 框架与样式

- **Tailwind CSS 3.4+**：原子化 CSS 框架，快速构建响应式界面
- **PrimeVue 4.3+**：企业级 Vue 组件库，提供丰富的 UI 组件
- **Element Plus 2.10+**：补充组件库，增强用户交互体验
- **Sass/SCSS**：CSS 预处理器，支持变量、嵌套和混入

#### 状态管理与路由

- **Pinia 3.0+**：Vue 官方推荐的状态管理库，类型安全且易于使用
- **Vue Router 4.5+**：官方路由管理器，支持动态路由和路由守卫
- **@vueuse/core**：Vue 组合式工具集，提供常用的响应式工具函数

#### 开发工具与优化

- **Axios 1.11+**：HTTP 客户端，支持请求拦截和响应处理
- **Prism.js 1.30+**：代码语法高亮库，支持多种编程语言
- **Marked 16.1+**：Markdown 解析器，支持扩展语法
- **DOMPurify**：HTML 净化库，防止 XSS 攻击
- **unplugin-auto-import**：自动导入 Vue API 和组件
- **unplugin-icons**：图标自动导入，支持多个图标库

### 后端技术栈 (Server)

#### 运行环境与框架

- **Node.js 18+**：JavaScript 运行时环境
- **Express 5.1+**：轻量级 Web 应用框架
- **TypeScript**：可选的类型支持，提升代码质量

#### 数据库与缓存

- **MySQL 8.0+**：关系型数据库，支持 JSON 字段和全文索引
- **Knex.js 3.1+**：SQL 查询构建器，支持数据库迁移和种子数据
- **Redis 7.0+**：内存数据库，用于缓存和会话存储
- **ioredis 5.6+**：Redis 客户端，支持集群和哨兵模式

#### 认证与安全

- **JWT (jsonwebtoken)**：无状态身份验证
- **bcryptjs**：密码哈希加密
- **express-session**：会话管理中间件
- **express-rate-limit**：API 请求频率限制
- **cors**：跨域资源共享配置

#### 日志与监控

- **Winston 3.17+**：结构化日志记录
- **Morgan**：HTTP 请求日志中间件
- **PM2**：生产环境进程管理器
- **Nodemon**：开发环境自动重启工具

#### 通信与工具

- **Nodemailer 7.0+**：邮件发送服务
- **svg-captcha**：验证码生成
- **lodash**：JavaScript 工具库
- **js-yaml**：YAML 配置文件解析

### 管理后台 (Dashboard)

#### 框架与特性

- **BuildAdmin**：基于 Vue3 + ThinkPHP8 的后台管理系统
- **CRUD 代码生成**：自动生成增删改查功能
- **Web 终端**：在线命令行操作界面
- **模块市场**：扩展功能模块管理
- **权限管理**：细粒度的用户权限控制

### 开发工具链

#### 代码质量

- **ESLint 9.0+**：JavaScript/TypeScript 代码检查
- **Prettier 3.6+**：代码格式化工具
- **vue-tsc**：Vue 单文件组件类型检查
- **lint-staged**：Git 提交前代码检查

#### 构建与部署

- **Docker**：容器化部署
- **Docker Compose**：多容器编排
- **Vercel**：前端静态部署平台
- **PM2**：Node.js 生产环境进程管理
- 具体使用最好直接把项目下的**.7z**压缩包直接上传服务器解压可以避免安装问题

#### 包管理

- **pnpm**：快速、节省磁盘空间的包管理器
- **npm scripts**：项目脚本管理
- **concurrently**：并行运行多个命令

## 🚀 快速开始

### 环境要求

在开始之前，请确保您的开发环境满足以下要求：

- **Node.js 18+**：JavaScript 运行时环境
- **pnpm**（推荐）或 npm：包管理器
- **MySQL 8.0+**：确保版本足够的关系型数据库 
- **Redis 7.0+**：内存数据库
- **Git**：版本控制工具


### 安装步骤

#### 1. 克隆项目仓库

```bash
# 使用 HTTPS
git clone https://github.com/your-username/syntaxseed.git

# 或使用 SSH
git clone git@github.com:your-username/syntaxseed.git

# 进入项目目录
cd syntaxseed
```

#### 2. 安装项目依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

#### 3. 环境配置

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量文件
# Windows 用户可以使用 notepad .env
# macOS/Linux 用户可以使用 vim .env 或 nano .env
```

**重要环境变量配置说明：**

```bash
# 应用基础配置
NODE_ENV=development          # 开发环境
PORT=7204                    # 后端服务端口
APP_NAME=SyntaxSeed          # 应用名称

# 数据库配置
DB_HOST=localhost            # 数据库主机
DB_PORT=3306                # 数据库端口
DB_USER=root                # 数据库用户名
DB_PASSWORD=your-password    # 数据库密码（请修改）
DB_NAME=syntaxseed          # 数据库名称

# Redis 配置
REDIS_HOST=localhost         # Redis主机
REDIS_PORT=6379             # Redis端口
REDIS_PASSWORD=your-redis-password  # Redis密码（请修改）

# JWT 密钥配置（生产环境必须修改）
JWT_ACCESS_SECRET=your-super-secure-access-secret
JWT_REFRESH_SECRET=your-super-secure-refresh-secret
SESSION_SECRET=your-super-secure-session-secret
```

#### 4. 数据库初始化

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE syntaxseed CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 导入数据库结构（如果有 SQL 文件）
mysql -u root -p syntaxseed < syntaxseed.sql

# 或者运行数据库迁移（如果使用 Knex 迁移）
cd server
npx knex migrate:latest
npx knex seed:run
```

#### 5. 启动开发服务器

```bash
# 返回项目根目录
cd ..

# 同时启动前端和后端服务
pnpm dev

# 或者分别启动服务
pnpm dev:client    # 仅启动前端服务 (http://localhost:5173)
pnpm dev:server    # 仅启动后端服务 (http://localhost:7204)
```

### 验证安装

启动成功后，您可以通过以下方式验证安装：

1. **前端应用**：访问 http://localhost:5173
2. **后端 API**：访问 http://localhost:7204/api/health
3. **数据库连接**：检查控制台是否有数据库连接成功的日志
4. **Redis 连接**：检查控制台是否有 Redis 连接成功的日志

### 常见问题解决

#### 端口冲突

如果遇到端口被占用的问题：

```bash
# 查看端口占用情况
# Windows
netstat -ano | findstr :5173
netstat -ano | findstr :7204

# macOS/Linux
lsof -i :5173
lsof -i :7204

# 修改端口配置
# 前端端口：修改 client/vite.config.ts 中的 server.port
# 后端端口：修改 .env 文件中的 PORT 变量
```

#### 数据库连接失败

```bash
# 检查 MySQL 服务是否启动
# Windows
net start mysql

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql

# 测试数据库连接
mysql -u root -p -h localhost -P 3306
```

#### Redis 连接失败

```bash
# 检查 Redis 服务是否启动
# Windows（如果使用 WSL）
sudo service redis-server start

# macOS
brew services start redis

# Linux
sudo systemctl start redis

# 测试 Redis 连接
redis-cli ping
```

## 📦 可用脚本命令

### 根目录命令

```bash
# 依赖管理
pnpm install              # 安装所有项目依赖
pnpm install --frozen-lockfile  # 严格按照 lockfile 安装依赖

# 开发服务
pnpm dev                  # 同时启动前端和后端开发服务器
pnpm dev:client           # 仅启动前端开发服务器 (Vite)
pnpm dev:server           # 仅启动后端开发服务器 (Nodemon)

# 项目管理
pnpm clean                # 清理所有 node_modules 和构建文件
pnpm reset                # 重置项目（清理 + 重新安装依赖）
```

### 前端命令 (Client)

```bash
cd client

# 开发相关
pnpm dev                  # 启动 Vite 开发服务器 (http://localhost:5173)
pnpm dev --host           # 启动开发服务器并允许外部访问
pnpm dev --port 3000      # 指定端口启动开发服务器

# 构建相关
pnpm build                # 构建生产版本
pnpm build:dev            # 构建开发版本（包含 source map）
pnpm build-with-typecheck # 构建前进行 TypeScript 类型检查
pnpm preview              # 预览构建后的应用

# 代码质量
pnpm type-check           # TypeScript 类型检查
pnpm type-check --watch   # 监听模式下的类型检查
pnpm lint                 # ESLint 代码检查并自动修复
pnpm lint:check           # 仅检查不修复
pnpm format               # Prettier 代码格式化
pnpm format:check         # 检查代码格式是否符合规范

# SEO 优化
pnpm seo:generate         # 生成 SEO 相关文件（sitemap、robots.txt等）
pnpm seo:check            # 检查 SEO 配置并生成报告

# 测试相关
pnpm test                 # 运行单元测试
pnpm test:watch           # 监听模式下运行测试
pnpm test:coverage        # 生成测试覆盖率报告

# 分析工具
pnpm analyze              # 分析构建包大小
pnpm bundle-analyzer      # 可视化分析构建包
```

### 后端命令 (Server)

```bash
cd server

# 开发相关
pnpm dev                  # 使用 Nodemon 启动开发服务器
pnpm dev:debug            # 调试模式启动开发服务器
pnpm dev:cluster          # 集群模式启动开发服务器

# 生产部署
pnpm start                # 生产环境启动服务器
pnpm start:cluster        # 集群模式启动生产服务器
pnpm start:single         # 单进程模式启动生产服务器

# 数据库管理
pnpm db:migrate           # 运行数据库迁移
pnpm db:migrate:rollback  # 回滚数据库迁移
pnpm db:seed              # 运行数据库种子数据
pnpm db:reset             # 重置数据库（迁移 + 种子数据）

# 工具命令
pnpm logs                 # 查看应用日志
pnpm logs:error           # 查看错误日志
pnpm health               # 健康检查
pnpm cache:clear          # 清理 Redis 缓存
```

### 管理后台命令 (Dashboard)

```bash
cd dashboard

# PHP 依赖管理
composer install          # 安装 PHP 依赖
composer update           # 更新 PHP 依赖

# 前端资源构建
pnpm install              # 安装前端依赖
pnpm build                # 构建前端资源

# 开发服务
php think serve           # 启动 ThinkPHP 开发服务器
php think queue:work      # 启动队列处理器
```

### Docker 命令

```bash
# 开发环境
docker-compose -f docker-compose-dev.yml up -d     # 启动开发环境
docker-compose -f docker-compose-dev.yml down      # 停止开发环境
docker-compose -f docker-compose-dev.yml logs -f   # 查看日志

# 生产环境
docker-compose -f docker-compose.prod.simple.yml up -d    # 启动生产环境
docker-compose -f docker-compose.prod.simple.yml down     # 停止生产环境

# 容器管理
docker-compose ps         # 查看容器状态
docker-compose exec backend bash    # 进入后端容器
docker-compose exec database mysql -u root -p    # 连接数据库
```

### 实用工具脚本

```bash
# 项目初始化
npm run setup             # 一键设置开发环境

# 代码生成
npm run generate:component    # 生成 Vue 组件模板
npm run generate:api         # 生成 API 接口模板
npm run generate:page        # 生成页面组件模板

# 部署相关
npm run deploy:dev           # 部署到开发环境
npm run deploy:staging       # 部署到测试环境
npm run deploy:prod          # 部署到生产环境

# 备份与恢复
npm run backup:db            # 备份数据库
npm run restore:db           # 恢复数据库
```

## 🐳 Docker 容器化部署

### 开发环境部署

#### 快速启动

```bash
# 启动所有服务（前端、后端、数据库、Redis）
docker-compose -f docker-compose-dev.yml up -d

# 查看服务状态
docker-compose -f docker-compose-dev.yml ps

# 查看实时日志
docker-compose -f docker-compose-dev.yml logs -f

# 停止所有服务
docker-compose -f docker-compose-dev.yml down
```

#### 单独管理服务

```bash
# 仅启动数据库和 Redis
docker-compose -f docker-compose-dev.yml up -d database redis

# 重启特定服务
docker-compose -f docker-compose-dev.yml restart backend

# 查看特定服务日志
docker-compose -f docker-compose-dev.yml logs -f backend
```

### 生产环境部署 （**LOOK ME important**）

#### 生产环境配置

```bash
# 启动生产环境
docker-compose -f docker-compose.prod.simple.yml up -d

# 检查服务健康状态
docker-compose -f docker-compose.prod.simple.yml exec backend curl http://localhost:7204/api/health

# 查看生产日志
docker-compose -f docker-compose.prod.simple.yml logs --tail=100 -f
```

#### 生产环境维护

```bash
# 更新应用（零停机部署）
docker-compose -f docker-compose.prod.simple.yml pull
docker-compose -f docker-compose.prod.simple.yml up -d --no-deps backend frontend

# 备份数据库
docker-compose -f docker-compose.prod.simple.yml exec database mysqldump -u root -p syntaxseed > backup.sql

# 清理未使用的镜像
docker system prune -a
```

### 服务访问地址

部署成功后，您可以通过以下地址访问各项服务：

| 服务     | 开发环境              | 生产环境       | 说明            |
| -------- | --------------------- | -------------- | --------------- |
| 前端应用 | http://localhost:8080 | /              | Vue.js 应用     |
| 后端 API | http://localhost:7204 | /              | Express.js API  |
| 管理后台 | http://localhost:8081 | /              | BuildAdmin 后台 |
| MySQL    | localhost:3307        | localhost:3307 | 数据库服务      |
| Redis    | localhost:6379        | localhost:6379 | 缓存服务        |

### Docker 环境变量配置

在 `docker-compose.yml` 文件中，您可以配置以下环境变量：

```yaml
environment:
  # 应用配置
  NODE_ENV: production
  PORT: 7204
  APP_NAME: SyntaxSeed

  # 数据库配置
  DB_HOST: database
  DB_PORT: 3306
  DB_USER: root
  DB_PASSWORD: syntaxseed_password
  DB_NAME: syntaxseed

  # Redis 配置
  REDIS_HOST: redis
  REDIS_PORT: 6379
  REDIS_PASSWORD: redis_password

  # 集群配置
  CLUSTER_ENABLED: true
  CLUSTER_WORKERS: 2
```

## 🌐 部署方案

### Vercel 部署（推荐）

Vercel 是最适合前端应用的部署平台，项目已配置好 `vercel.json`。

#### 自动部署设置

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 初始化项目
vercel

# 4. 配置环境变量（在 Vercel 控制台）
# - NODE_ENV=production
# - DATABASE_URL=your-database-url
# - REDIS_URL=your-redis-url
# - JWT_ACCESS_SECRET=your-jwt-secret

# 5. 部署
vercel --prod
```

#### GitHub 集成部署

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 控制台连接 GitHub 仓库
3. 配置环境变量
4. 每次推送到 main 分支自动部署

### 传统服务器部署

#### 准备服务器环境

```bash
# 1. 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 安装 pnpm
npm install -g pnpm

# 3. 安装 PM2
npm install -g pm2

# 4. 安装 MySQL 和 Redis
sudo apt-get install mysql-server redis-server
```

#### 部署步骤

```bash
# 1. 克隆代码
git clone https://github.com/your-username/syntaxseed.git
cd syntaxseed

# 2. 安装依赖
pnpm install

# 3. 构建前端
cd client
pnpm build
cd ..

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 5. 初始化数据库
mysql -u root -p syntaxseed < syntaxseed.sql

# 6. 启动服务
cd server
pm2 start ecosystem.config.js --env production
```

### 云服务器部署

#### 阿里云 ECS 部署

```bash
# 1. 购买 ECS 实例（推荐配置：2核4G）
# 2. 安装宝塔面板或直接配置 Nginx
# 3. 配置域名和 SSL 证书
# 4. 按照传统服务器部署步骤操作
```

#### 腾讯云 CVM 部署

```bash
# 1. 购买 CVM 实例
# 2. 配置安全组规则（开放 80、443、7204 端口）
# 3. 安装 Docker 和 Docker Compose
# 4. 使用 Docker 部署方案
```

### CDN 和静态资源优化

#### 配置 CDN 加速

```bash
# 1. 将构建后的静态资源上传到 OSS/COS
# 2. 配置 CDN 域名
# 3. 修改前端构建配置中的 publicPath
```

#### 静态资源压缩

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue", "vue-router", "pinia"],
          ui: ["primevue", "element-plus"],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

## 📁 项目结构详解

### 完整目录结构

```
SyntaxSeed/
├── client/                           # 前端应用目录
│   ├── src/                         # 源代码目录
│   │   ├── assets/                  # 静态资源
│   │   │   ├── images/              # 图片资源
│   │   │   ├── icons/               # 图标文件
│   │   │   ├── fonts/               # 字体文件
│   │   │   └── styles/              # 全局样式
│   │   ├── components/              # 可复用组件
│   │   │   ├── common/              # 通用组件
│   │   │   │   ├── BaseButton.vue   # 基础按钮组件
│   │   │   │   ├── BaseModal.vue    # 基础弹窗组件
│   │   │   │   └── BaseLoading.vue  # 加载组件
│   │   │   ├── layout/              # 布局组件
│   │   │   │   ├── AppHeader.vue    # 应用头部
│   │   │   │   ├── AppSidebar.vue   # 侧边栏
│   │   │   │   └── AppFooter.vue    # 应用底部
│   │   │   └── business/            # 业务组件
│   │   │       ├── BlogCard.vue     # 博客卡片
│   │   │       ├── ProjectCard.vue  # 项目卡片
│   │   │       └── SkillChart.vue   # 技能图表
│   │   ├── composables/             # 组合式函数
│   │   │   ├── useAuth.ts           # 认证相关
│   │   │   ├── useTheme.ts          # 主题切换
│   │   │   └── useApi.ts            # API 调用
│   │   ├── router/                  # 路由配置
│   │   │   ├── index.ts             # 路由主文件
│   │   │   └── guards.ts            # 路由守卫
│   │   ├── stores/                  # 状态管理
│   │   │   ├── auth.ts              # 认证状态
│   │   │   ├── blog.ts              # 博客状态
│   │   │   └── user.ts              # 用户状态
│   │   ├── utils/                   # 工具函数
│   │   │   ├── request.ts           # HTTP 请求封装
│   │   │   ├── storage.ts           # 本地存储
│   │   │   └── helpers.ts           # 辅助函数
│   │   ├── views/                   # 页面组件
│   │   │   ├── Home.vue             # 首页
│   │   │   ├── Blog/                # 博客相关页面
│   │   │   ├── Projects/            # 项目展示页面
│   │   │   └── About.vue            # 关于页面
│   │   ├── types/                   # TypeScript 类型定义
│   │   │   ├── api.ts               # API 接口类型
│   │   │   ├── user.ts              # 用户类型
│   │   │   └── blog.ts              # 博客类型
│   │   └── main.ts                  # 应用入口文件
│   ├── public/                      # 公共静态资源
│   │   ├── favicon.ico              # 网站图标
│   │   ├── robots.txt               # 搜索引擎爬虫规则
│   │   └── sitemap.xml              # 网站地图
│   ├── dist/                        # 构建输出目录
│   ├── .env.development             # 开发环境变量
│   ├── .env.production              # 生产环境变量
│   ├── vite.config.ts               # Vite 配置文件
│   ├── tailwind.config.js           # Tailwind CSS 配置
│   ├── tsconfig.json                # TypeScript 配置
│   └── package.json                 # 前端依赖配置
├── server/                          # 后端服务目录
│   ├── auth/                        # 认证相关
│   │   ├── middleware.js            # 认证中间件
│   │   ├── jwt.js                   # JWT 工具
│   │   └── strategies.js            # 认证策略
│   ├── config/                      # 配置文件
│   │   ├── database.js              # 数据库配置
│   │   ├── redis.js                 # Redis 配置
│   │   └── app.js                   # 应用配置
│   ├── controllers/                 # 控制器
│   │   ├── authController.js        # 认证控制器
│   │   ├── blogController.js        # 博客控制器
│   │   └── userController.js        # 用户控制器
│   ├── middleware/                  # 中间件
│   │   ├── cors.js                  # 跨域处理
│   │   ├── rateLimit.js             # 频率限制
│   │   └── errorHandler.js          # 错误处理
│   ├── models/                      # 数据模型
│   │   ├── User.js                  # 用户模型
│   │   ├── Blog.js                  # 博客模型
│   │   └── Project.js               # 项目模型
│   ├── routes/                      # 路由定义
│   │   ├── auth.js                  # 认证路由
│   │   ├── blog.js                  # 博客路由
│   │   └── api.js                   # API 路由
│   ├── services/                    # 业务服务
│   │   ├── authService.js           # 认证服务
│   │   ├── blogService.js           # 博客服务
│   │   └── emailService.js          # 邮件服务
│   ├── utils/                       # 工具函数
│   │   ├── logger.js                # 日志工具
│   │   ├── validator.js             # 数据验证
│   │   └── helpers.js               # 辅助函数
│   ├── logs/                        # 日志文件
│   │   ├── app.log                  # 应用日志
│   │   ├── error.log                # 错误日志
│   │   └── access.log               # 访问日志
│   ├── migrations/                  # 数据库迁移
│   ├── seeds/                       # 数据库种子
│   ├── index.js                     # 服务器入口文件
│   ├── start.js                     # 生产启动脚本
│   ├── cluster.js                   # 集群配置
│   └── package.json                 # 后端依赖配置
├── dashboard/                       # 管理后台目录
│   ├── app/                         # ThinkPHP 应用代码
│   ├── config/                      # 框架配置
│   ├── public/                      # 公共资源
│   ├── web/                         # 前端构建输出
│   └── composer.json                # PHP 依赖配置
├── docs/                            # 项目文档
│   ├── api.md                       # API 文档
│   ├── deployment.md                # 部署文档
│   └── development.md               # 开发文档
├── scripts/                         # 构建脚本
│   ├── build.sh                     # 构建脚本
│   ├── deploy.sh                    # 部署脚本
│   └── backup.sh                    # 备份脚本
├── docker/                          # Docker 配置
│   ├── Dockerfile.client            # 前端 Docker 文件
│   ├── Dockerfile.server            # 后端 Docker 文件
│   └── nginx.conf                   # Nginx 配置
├── .kiro/                           # Kiro AI 配置
├── .github/                         # GitHub 配置
│   └── workflows/                   # CI/CD 工作流
├── docker-compose.yml               # Docker 编排文件
├── docker-compose-dev.yml           # 开发环境 Docker 编排
├── docker-compose.prod.simple.yml   # 生产环境 Docker 编排
├── .env.example                     # 环境变量模板
├── .gitignore                       # Git 忽略文件
├── README.md                        # 项目说明文档
└── package.json                     # 根目录依赖配置
```

## 🔧 配置详解

### 环境变量配置

项目使用环境变量来管理不同环境下的配置，主要配置文件：

#### 应用基础配置

```bash
# 应用信息
NODE_ENV=production                    # 运行环境：development/production
PORT=7204                             # 后端服务端口
APP_NAME=SyntaxSeed                   # 应用名称
APP_VERSION=1.0.0                     # 应用版本

# 集群配置
CLUSTER_ENABLED=true                  # 是否启用集群模式
CLUSTER_WORKERS=2                     # 工作进程数量
```

#### 数据库配置

```bash
# MySQL 数据库
DB_HOST=localhost                     # 数据库主机地址
DB_PORT=3306                         # 数据库端口
DB_USER=root                         # 数据库用户名
DB_PASSWORD=your-secure-password      # 数据库密码
DB_NAME=syntaxseed                   # 数据库名称
DB_CHARSET=utf8mb4                   # 字符集
DB_TIMEZONE=+08:00                   # 时区设置

# 连接池配置
DB_POOL_MIN=5                        # 最小连接数
DB_POOL_MAX=20                       # 最大连接数
DB_POOL_ACQUIRE_TIMEOUT=30000        # 获取连接超时时间
DB_POOL_IDLE_TIMEOUT=300000          # 空闲连接超时时间
```

#### Redis 缓存配置

```bash
# Redis 连接
REDIS_HOST=localhost                  # Redis 主机地址
REDIS_PORT=6379                      # Redis 端口
REDIS_PASSWORD=your-redis-password    # Redis 密码
REDIS_DB=0                           # Redis 数据库编号
REDIS_PREFIX=syntax:prod:            # 键名前缀
REDIS_CONNECT_TIMEOUT=10000          # 连接超时时间
REDIS_COMMAND_TIMEOUT=5000           # 命令超时时间
```

#### 安全配置

```bash
# JWT 配置
JWT_ACCESS_SECRET=your-super-secure-access-secret-key
JWT_ACCESS_EXPIRES_IN=300            # 访问令牌过期时间（秒）
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=864000        # 刷新令牌过期时间（秒）
SESSION_SECRET=your-super-secure-session-secret

# 频率限制
RATE_LIMIT_WINDOW_MS=900000          # 时间窗口（毫秒）
RATE_LIMIT_MAX_REQUESTS=100          # 最大请求次数
```

#### 邮件服务配置

```bash
# SMTP 配置
MAIL_HOST=smtp.example.com           # SMTP 服务器
MAIL_PORT=587                        # SMTP 端口
MAIL_SECURE=false                    # 是否使用 SSL
MAIL_USER=your-email@example.com     # 邮箱用户名
MAIL_PASS=your-email-password        # 邮箱密码
MAIL_FROM=noreply@syntaxseed.com     # 发件人地址
```

### 数据库配置详解

#### MySQL 数据库设计

```sql
-- 数据库创建
CREATE DATABASE syntaxseed
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 主要数据表
-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 博客文章表
CREATE TABLE blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(255),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 项目展示表
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    tech_stack JSON,
    github_url VARCHAR(255),
    demo_url VARCHAR(255),
    featured_image VARCHAR(255),
    status ENUM('active', 'completed', 'archived') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Redis 缓存策略

```javascript
// 缓存键命名规范
const CACHE_KEYS = {
  USER_SESSION: "session:user:", // 用户会话
  BLOG_POST: "blog:post:", // 博客文章
  USER_PROFILE: "user:profile:", // 用户资料
  POPULAR_POSTS: "blog:popular", // 热门文章
  SITE_STATS: "site:stats", // 网站统计
};

// 缓存过期时间
const CACHE_TTL = {
  SESSION: 86400, // 24小时
  BLOG_POST: 3600, // 1小时
  USER_PROFILE: 1800, // 30分钟
  POPULAR_POSTS: 300, // 5分钟
  SITE_STATS: 600, // 10分钟
};
```

## 🎯 目标用户群体

### 主要用户群体

- **高中生开发者**：刚开始学习编程的学生
- **年轻程序员**：初入职场的开发者
- **技术爱好者**：对编程有浓厚兴趣的学习者
- **开源贡献者**：希望展示自己项目的开发者

### 用户需求分析

1. **学习记录**：记录技术学习过程和心得
2. **作品展示**：展示个人项目和技术能力
3. **经验分享**：与同龄人分享开发经验
4. **职业发展**：为未来求职做准备

### 平台价值主张

- 提供专业的技术博客写作环境
- 构建年轻开发者社区
- 帮助用户建立个人技术品牌
- 促进技术知识的传播和交流

## 🤝 参与贡献

我们欢迎所有形式的贡献，无论是代码、文档、设计还是想法建议。

### 贡献方式

#### 代码贡献

1. **Fork 项目仓库**

   ```bash
   # 点击 GitHub 页面右上角的 Fork 按钮
   # 或使用 GitHub CLI
   gh repo fork your-username/syntaxseed
   ```

2. **克隆到本地**

   ```bash
   git clone https://github.com/your-username/syntaxseed.git
   cd syntaxseed
   ```

3. **创建功能分支**

   ```bash
   # 创建并切换到新分支
   git checkout -b feature/amazing-feature

   # 或者修复 bug
   git checkout -b fix/bug-description

   # 或者改进文档
   git checkout -b docs/improve-readme
   ```

4. **进行开发**

   ```bash
   # 安装依赖
   pnpm install

   # 启动开发服务器
   pnpm dev

   # 进行你的修改...
   ```

5. **代码质量检查**

   ```bash
   # 运行代码检查
   cd client && pnpm lint
   cd ../server && pnpm lint

   # 运行类型检查
   cd client && pnpm type-check

   # 运行测试
   pnpm test
   ```

6. **提交更改**

   ```bash
   # 添加更改的文件
   git add .

   # 提交更改（请使用有意义的提交信息）
   git commit -m "feat: 添加用户头像上传功能"

   # 或者
   git commit -m "fix: 修复博客文章分页问题"
   git commit -m "docs: 更新 API 文档"
   git commit -m "style: 优化移动端响应式布局"
   ```

7. **推送到远程仓库**

   ```bash
   git push origin feature/amazing-feature
   ```

8. **创建 Pull Request**
   - 访问 GitHub 仓库页面
   - 点击 "Compare & pull request" 按钮
   - 填写 PR 标题和描述
   - 等待代码审查

### 提交信息规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能添加
git commit -m "feat: 添加用户注册功能"

# Bug 修复
git commit -m "fix: 修复登录页面验证码显示问题"

# 文档更新
git commit -m "docs: 更新部署文档"

# 样式调整
git commit -m "style: 调整博客卡片间距"

# 代码重构
git commit -m "refactor: 重构用户认证逻辑"

# 性能优化
git commit -m "perf: 优化图片加载性能"

# 测试相关
git commit -m "test: 添加用户服务单元测试"

# 构建相关
git commit -m "build: 更新 Vite 配置"

# CI/CD 相关
git commit -m "ci: 添加自动部署工作流"
```

### 代码规范

#### 前端代码规范

- 使用 TypeScript 进行类型定义
- 遵循 Vue 3 Composition API 最佳实践
- 使用 ESLint 和 Prettier 保持代码风格一致
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

#### 后端代码规范

- 使用 ES6+ 语法
- 遵循 RESTful API 设计原则
- 使用 JSDoc 注释重要函数
- 错误处理要完整和一致
- 数据库查询要进行参数化防止 SQL 注入

### 问题报告

如果您发现了 bug 或有功能建议，请：

1. **搜索现有 Issues**：确保问题未被报告过
2. **创建新 Issue**：使用合适的模板
3. **提供详细信息**：
   - 问题描述
   - 复现步骤
   - 期望行为
   - 实际行为
   - 环境信息（浏览器、Node.js 版本等）
   - 截图或错误日志

### 功能请求

提交功能请求时，请包含：

1. **功能描述**：清晰描述您希望添加的功能
2. **使用场景**：说明为什么需要这个功能
3. **实现建议**：如果有想法，可以提供实现思路
4. **相关资源**：提供相关的设计稿、参考链接等

### 文档贡献

文档同样重要，您可以：

- 修复文档中的错误
- 改进文档的清晰度
- 添加缺失的文档
- 翻译文档到其他语言
- 添加使用示例和教程

## 📄 开源协议

本项目采用 [ISC License](LICENSE) 开源协议。

### ISC License 说明

ISC License 是一个简洁的开源许可证，允许：

- ✅ **商业使用**：可以用于商业项目
- ✅ **修改**：可以修改源代码
- ✅ **分发**：可以分发原始或修改后的代码
- ✅ **私人使用**：可以私人使用
- ✅ **专利使用**：提供专利使用权

要求：

- 📋 **包含许可证**：在分发时必须包含原始许可证
- 📋 **包含版权声明**：必须包含原始版权声明

### 第三方依赖许可证

项目使用的主要第三方库及其许可证：

| 依赖         | 许可证 | 说明       |
| ------------ | ------ | ---------- |
| Vue.js       | MIT    | 前端框架   |
| Express.js   | MIT    | 后端框架   |
| MySQL        | GPL v2 | 数据库     |
| Redis        | BSD    | 缓存数据库 |
| Tailwind CSS | MIT    | CSS 框架   |
| PrimeVue     | MIT    | UI 组件库  |

## 🆘 问题排查

### 常见问题及解决方案

#### 安装和启动问题

**问题：pnpm install 失败**

```bash
# 解决方案
# 1. 清理缓存
pnpm store prune

# 2. 删除 node_modules 重新安装
rm -rf node_modules
pnpm install

# 3. 使用 npm 替代
npm install
```

**问题：端口被占用**

```bash
# 查看端口占用
# Windows
netstat -ano | findstr :5173
netstat -ano | findstr :7204

# macOS/Linux
lsof -i :5173
lsof -i :7204

# 杀死进程
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

**问题：数据库连接失败**

```bash
# 检查 MySQL 服务状态
# Windows
net start mysql

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
sudo systemctl status mysql

# 测试连接
mysql -u root -p -h localhost -P 3306
```

#### 开发环境问题

**问题：热重载不工作**

```javascript
// vite.config.ts
export default defineConfig({
  server: {
    watch: {
      usePolling: true, // 在某些系统上需要启用轮询
    },
  },
});
```

**问题：TypeScript 类型错误**

```bash
# 重新生成类型文件
cd client
pnpm type-check

# 清理 TypeScript 缓存
rm -rf node_modules/.cache
```

**问题：样式不生效**

```bash
# 检查 Tailwind CSS 配置
# 确保在 main.ts 中导入了样式文件
import './assets/styles/main.css'

# 重新构建样式
pnpm build:css
```

### 性能优化建议

#### 前端性能优化

1. **代码分割**：使用动态导入分割路由组件
2. **图片优化**：使用 WebP 格式，添加懒加载
3. **缓存策略**：合理设置浏览器缓存
4. **Bundle 分析**：使用 `pnpm analyze` 分析包大小

#### 后端性能优化

1. **数据库索引**：为常用查询字段添加索引
2. **Redis 缓存**：缓存热点数据
3. **连接池**：合理配置数据库连接池
4. **日志级别**：生产环境调整日志级别

### 调试技巧

#### 前端调试

```javascript
// 使用 Vue Devtools
// 在组件中添加调试信息
console.log("Component data:", toRaw(data));

// 使用 Vite 的 HMR API
if (import.meta.hot) {
  import.meta.hot.accept();
}
```

#### 后端调试

```javascript
// 使用 Winston 日志
const logger = require('./utils/logger')

logger.info('API request received', {
  method: req.method,
  url: req.url,
  user: req.user?.id
})

// 使用 Node.js 调试器
node --inspect index.js
```

## 📞 技术支持

### 获取帮助的方式

1. **查看文档**：

   - [开发文档](DEVELOPMENT_TROUBLESHOOTING.md)
   - [API 文档](docs/api.md)
   - [部署文档](docs/deployment.md)

2. **社区支持**：

   - 在 GitHub Issues 中搜索相关问题
   - 创建新的 Issue 描述您的问题

3. **联系方式**：
   - 📧 邮箱：sqj@shiqianjiang.cn
   - 💬 QQ 群：488357273
   - 💬 wx :13600973542

### 贡献者

感谢所有为 SyntaxSeed 项目做出贡献的开发者：

<!-- 这里可以添加贡献者头像 -->
<a href="https://github.com/your-username/syntaxseed/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=your-username/syntaxseed" />
</a>

### 项目统计

![GitHub stars](https://img.shields.io/github/stars/your-username/syntaxseed?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/syntaxseed?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/syntaxseed)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/syntaxseed)

---

<div align="center">

**🌟 如果这个项目对您有帮助，请给我们一个 Star！**

**Built with ❤️ by the SyntaxSeed Team**

_让每一行代码都成为成长的见证_

</div>
