# SyntaxSeed - 开发者成长日志 | 技术分析博客

一个面向高中生开发者的简约高端技术博客，展示网站开发历程和技术分析。

![SyntaxSeed](https://img.shields.io/badge/SyntaxSeed-开发者成长日志-blue)
![Vue](https://img.shields.io/badge/Vue-3.3.4-brightgreen)
![Vite](https://img.shields.io/badge/Vite-4.4.9-yellow)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-blue)
![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey)

## 设计理念

- **主题**：开发者成长日志 | 技术分析博客
- **视觉风格**：动态海洋蓝 × 简约科技感 × 微交互动画

## 核心设计规范

| **元素**     | **规范说明**                    |
| ------------ | ------------------------------- |
| **主色调**   | 浅色模式： #F0F7FF (浅天蓝)     |
|              | 深色模式： #0A192F (深海蓝)     |
|              | 强调色： #2A9D8F (海洋绿松石)   |
|              | 代码高亮： #64FFDA (霓虹青)     |
| **字体组合** | 标题：Montserrat (科技感无衬线) |
|              | 正文：Open Sans (高可读性)      |
|              | 代码：Fira Code (连字等宽字体)  |
| **动效原则** | 波浪背景动画 + 卡片悬停3D翻转   |
|              | 进度条流体效果 + 按钮微交互     |

## 技术栈

- **前端框架**：Vue 3 + Vite
- **CSS框架**：Tailwind CSS
- **UI组件库**：PrimeVue
- **动效库**：Framer Motion
- **代码高亮**：Prism.js

## 功能特点

- 响应式设计，适配各种设备屏幕
- 暗黑/明亮模式切换
- 博客文章阅读和分类
- 项目展示和筛选
- 成长时间轴
- 技术栈展示
- 3D卡片翻转效果
- 波浪背景动画

## 快速开始

### 前端部分

#### 安装依赖

```bash
# 在项目根目录下执行
npm install
# 或
pnpm install
```

#### 开发模式

```bash
npm run dev
# 或
pnpm dev
```

#### 构建生产版本

```bash
npm run build
# 或
pnpm build
```

#### 预览生产版本

```bash
npm run preview
# 或
pnpm preview
```

### 后端部分

#### 安装依赖

```bash
# 进入serves目录
cd serves

# 安装依赖
npm install
# 或
pnpm install
```

#### 开发模式

```bash
# 在serves目录下
npm run dev
# 或
pnpm dev
```

## 项目结构

```
/
├── public/              # 静态资源
├── src/
│   ├── assets/          # 项目资源文件
│   ├── components/      # 通用组件
│   ├── router/          # 路由配置
│   ├── views/           # 页面视图
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── serves/              # 后端服务
│   ├── getData/         # API路由和处理函数
│   ├── db.js            # 数据库连接配置
│   ├── db.config.yaml   # 数据库参数配置
│   └── index.js         # 服务入口文件
├── .env.development     # 开发环境配置
├── .env.production      # 生产环境配置
├── index.html           # HTML模板
├── package.json         # 前端项目依赖
├── vite.config.ts       # Vite配置
├── tailwind.config.js   # Tailwind CSS配置
└── README.md            # 项目说明
```

## 部署指南

### 环境要求

- Node.js 16.x 或更高版本
- MySQL 8.0 或更高版本
- 支持HTTPS的Web服务器（推荐Nginx）

### 数据库配置

1. 创建MySQL数据库

```sql
CREATE DATABASE syntaxseed CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 配置数据库连接

编辑 `serves/db.config.yaml` 文件，设置正确的数据库连接信息：

```yaml
db:
  client: "mysql2"
  connection:
    host: "your-database-host"
    user: "your-database-user"
    password: "your-database-password"
    database: "syntaxseed"
    port: 3306
```

### 前端部署

1. 构建前端项目

```bash
# 在项目根目录下
npm run build
# 或
pnpm build
```

2. 配置环境变量

确保 `.env.production` 文件中的API地址配置正确：

```
VITE_API_BASEURL=/api
VITE_staticHost=<你的静态资源地址>
```

3. 部署到Web服务器

将 `dist` 目录下的所有文件复制到Web服务器的根目录。

### 后端部署

1. 安装PM2（用于生产环境进程管理）

```bash
npm install -g pm2
```

2. 启动后端服务

```bash
# 进入serves目录
cd serves

# 安装依赖
npm install

# 使用PM2启动服务
pm2 start index.js --name "syntaxseed-api"
```

3. 配置Nginx反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 重定向HTTP到HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    # SSL证书配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # 前端静态文件
    location / {
        root /path/to/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api/ {
        proxy_pass http://localhost:7204/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 常见问题

1. **API连接失败**
   - 检查后端服务是否正常运行
   - 确认Nginx配置中的代理路径是否正确
   - 验证防火墙是否允许7204端口的流量

2. **数据库连接错误**
   - 确认数据库凭据是否正确
   - 检查数据库服务器是否允许远程连接
   - 验证数据库用户是否有足够的权限

3. **前端资源加载失败**
   - 检查静态资源路径是否正确
   - 确认环境变量配置是否正确

## 自定义配置

查看 [Vite配置参考](https://vitejs.dev/config/).

## 后台面板

- Buildadmin 官网：[Buildadmin](官网：[Buildadmin](https://www.buildadmin.com/)
  后台面板是一个基于Vue3的后台管理系统，用于管理SyntaxSeed的博客内容。

### 功能特点

- 文章管理：添加、编辑、删除文章
- 分类管理：创建、编辑、删除文章分类
- 项目管理：添加、编辑、删除项目
- 成长时间轴管理：添加、编辑、删除时间轴条目
- 技术栈管理：添加、编辑、删除技术栈条目
- 页面管理：添加、编辑、删除页面
- 用户管理：添加、编辑、删除用户
- 权限管理：管理用户权限
- 配置管理：管理系统配置
- 日志管理：查看系统日志
- 系统设置：管理系统设置
- 系统信息：查看系统信息
- 系统更新：检查系统更新
- 系统帮助：查看系统帮助
- 系统退出：退出系统

### 安装指南

参考buildadmin 官网文档

## 许可证

本项目采用 MIT 许可证。详情请参阅 LICENSE 文件。
