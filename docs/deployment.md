# SyntaxSeed 部署文档

> 本文档详细介绍了 SyntaxSeed 项目的各种部署方案，包括开发环境、测试环境和生产环境的部署配置。

## 📋 目录

- [部署概览](#部署概览)
- [环境准备](#环境准备)
- [Docker 部署](#docker-部署)
- [Vercel 部署](#vercel-部署)
- [传统服务器部署](#传统服务器部署)
- [云服务器部署](#云服务器部署)
- [CDN 配置](#cdn-配置)
- [监控与维护](#监控与维护)
- [故障排除](#故障排除)

## 🎯 部署概览

### 部署架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        部署架构                              │
├─────────────────────────────────────────────────────────────┤
│  CDN (阿里云/腾讯云)                                         │
│  ├── 静态资源加速                                            │
│  └── 图片压缩优化                                            │
├─────────────────────────────────────────────────────────────┤
│  负载均衡器 (Nginx/ALB)                                      │
│  ├── SSL 终止                                               │
│  ├── 请求分发                                               │
│  └── 健康检查                                               │
├─────────────────────────────────────────────────────────────┤
│  应用服务器集群                                              │
│  ├── 前端服务 (Nginx + Vue SPA)                             │
│  ├── 后端服务 (Node.js + PM2)                               │
│  └── 管理后台 (PHP + Nginx)                                 │
├─────────────────────────────────────────────────────────────┤
│  数据存储层                                                  │
│  ├── MySQL 主从集群                                         │
│  ├── Redis 哨兵集群                                         │
│  └── 文件存储 (OSS/COS)                                     │
└─────────────────────────────────────────────────────────────┘
```

### 部署环境对比

| 环境       | 用途         | 配置      | 域名                   | 数据库           |
| ---------- | ------------ | --------- | ---------------------- | ---------------- |
| 开发环境   | 本地开发调试 | 2 核 4G   | localhost              | 本地 MySQL/Redis |
| 测试环境   | 功能测试验证 | 2 核 4G   | test.syntaxseed.com    | 测试数据库       |
| 预发布环境 | 上线前验证   | 4 核 8G   | staging.syntaxseed.com | 生产数据副本     |
| 生产环境   | 正式服务     | 8 核 16G+ | www.syntaxseed.com     | 生产数据库集群   |

## 🛠️ 环境准备

### 基础环境要求

#### 服务器配置要求

**最低配置（开发/测试环境）**

- CPU: 2 核
- 内存: 4GB
- 存储: 40GB SSD
- 带宽: 5Mbps
- 操作系统: Ubuntu 20.04+ / CentOS 8+

**推荐配置（生产环境）**

- CPU: 4 核以上
- 内存: 8GB 以上
- 存储: 100GB SSD 以上
- 带宽: 10Mbps 以上
- 操作系统: Ubuntu 22.04 LTS

#### 软件环境要求

```bash
# Node.js 环境
Node.js >= 18.0.0
npm >= 9.0.0
pnpm >= 8.0.0 (推荐)

# 数据库环境
MySQL >= 8.0
Redis >= 7.0

# Web 服务器
Nginx >= 1.20
PM2 >= 5.0 (Node.js 进程管理)

# 容器环境 (可选)
Docker >= 20.10
Docker Compose >= 2.0

# PHP 环境 (管理后台)
PHP >= 8.1
Composer >= 2.0
```

### 域名和 SSL 证书

#### 域名配置

```bash
# 主域名
www.syntaxseed.com      # 主站
api.syntaxseed.com      # API 服务
admin.syntaxseed.com    # 管理后台
cdn.syntaxseed.com      # CDN 资源

# 环境域名
dev.syntaxseed.com      # 开发环境
test.syntaxseed.com     # 测试环境
staging.syntaxseed.com  # 预发布环境
```

#### SSL 证书申请

```bash
# 使用 Let's Encrypt 免费证书
sudo apt install certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d www.syntaxseed.com -d api.syntaxseed.com

# 自动续期
sudo crontab -e
# 添加以下行
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🐳 Docker 部署

### 开发环境部署

#### 1. 准备配置文件

> 在对应 docker-compose-xx.yml 配置相关 密钥端口等环境变量
> 可参考 ![readme](https://github.com/timeshiftsauce/syntaxseed#-%E9%85%8D%E7%BD%AE%E8%AF%A6%E8%A7%A3)

#### 2. 启动开发环境

```bash
# 构建并启动所有服务
docker-compose -f docker-compose-dev.yml up -d

# 查看服务状态
docker-compose -f docker-compose-dev.yml ps

# 查看日志
docker-compose -f docker-compose-dev.yml logs -f
```

#### 3. 初始化数据库

```bash
# 进入数据库容器
docker-compose -f docker-compose-dev.yml exec database mysql -u root -p

# 或者导入初始数据
docker-compose -f docker-compose-dev.yml exec database mysql -u root -p syntaxseed < syntaxseed.sql
```

### 生产环境部署

#### 1. 生产环境配置

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile.prod
    ports:
      - "7204:7204"
    environment:
      NODE_ENV: production
      PORT: 7204
      CLUSTER_ENABLED: true
      CLUSTER_WORKERS: 4
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
    depends_on:
      - database
      - redis
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7204/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_CHARACTER_SET_SERVER: utf8mb4
      MYSQL_COLLATION_SERVER: utf8mb4_unicode_ci
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql/conf.d:/etc/mysql/conf.d
      - ./backup:/backup
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

volumes:
  mysql_data:
  redis_data:
```

#### 2. 生产环境启动

```bash
# 启动生产环境
docker-compose -f docker-compose.prod.yml up -d

# 检查服务状态
docker-compose -f docker-compose.prod.yml ps
```

### Docker 优化配置

#### Dockerfile 优化

```dockerfile
# client/Dockerfile.prod
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# server/Dockerfile.prod
FROM node:18-alpine

RUN apk add --no-cache dumb-init

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

USER node
EXPOSE 7204

CMD ["dumb-init", "node", "start.js"]
```

## 🌐 Vercel 部署

### 自动部署配置

#### 1. Vercel 项目配置

```json
{
  "version": 2,
  "name": "syntaxseed",
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist",
        "buildCommand": "pnpm build"
      }
    },
    {
      "src": "server/index.js",
      "use": "@vercel/node",
      "config": {
        "maxDuration": 30
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.js"
    },
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))",
      "dest": "/client/dist/$1",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "DATABASE_URL": "@database_url",
    "REDIS_URL": "@redis_url",
    "JWT_ACCESS_SECRET": "@jwt_access_secret",
    "JWT_REFRESH_SECRET": "@jwt_refresh_secret"
  },
  "functions": {
    "server/index.js": {
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "regions": ["hkg1", "sin1"]
}
```

#### 2. 环境变量配置

```bash
# 通过 Vercel CLI 配置环境变量
vercel env add NODE_ENV production
vercel env add DATABASE_URL mysql://user:password@host:port/database
vercel env add REDIS_URL redis://user:password@host:port
vercel env add JWT_ACCESS_SECRET your-super-secure-secret
vercel env add JWT_REFRESH_SECRET your-super-secure-refresh-secret

# 或者在 Vercel 控制台中配置
# https://vercel.com/your-username/syntaxseed/settings/environment-variables
```

#### 3. 部署脚本

```bash
#!/bin/bash
# scripts/deploy-vercel.sh

echo "🚀 开始部署到 Vercel..."

# 检查环境
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装，正在安装..."
    npm install -g vercel
fi

# 构建前端
echo "📦 构建前端应用..."
cd client
pnpm install
pnpm build
cd ..

# 部署到 Vercel
echo "🌐 部署到 Vercel..."
vercel --prod

echo "✅ 部署完成！"
```

### GitHub Actions 自动部署

```yaml
# .github/workflows/deploy-vercel.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Build client
        run: |
          cd client
          pnpm build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

## 🖥️ 传统服务器部署

### Ubuntu/Debian 服务器部署

#### 1. 系统环境准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y curl wget git vim htop

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 安装 PM2
npm install -g pm2

# 安装 Nginx
sudo apt install -y nginx

# 安装 MySQL
sudo apt install -y mysql-server

# 安装 Redis
sudo apt install -y redis-server
```

#### 2. 数据库配置

```bash
# MySQL 安全配置
sudo mysql_secure_installation

# 创建数据库和用户
sudo mysql -u root -p
```

```sql
-- 创建数据库
CREATE DATABASE syntaxseed CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'syntaxseed'@'localhost' IDENTIFIED BY 'your-secure-password';

-- 授权
GRANT ALL PRIVILEGES ON syntaxseed.* TO 'syntaxseed'@'localhost';
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

```bash
# Redis 配置
sudo vim /etc/redis/redis.conf

# 修改以下配置
# bind 127.0.0.1
# requirepass your-redis-password
# maxmemory 256mb
# maxmemory-policy allkeys-lru

# 重启 Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

#### 3. 应用部署

```bash
# 创建应用目录
sudo mkdir -p /var/www/syntaxseed
sudo chown $USER:$USER /var/www/syntaxseed

# 克隆代码
cd /var/www/syntaxseed
git clone https://github.com/your-username/syntaxseed.git .

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
vim .env

# 构建前端
cd client
pnpm build
cd ..

# 导入数据库
mysql -u syntaxseed -p syntaxseed < syntaxseed.sql
```

#### 4. PM2 进程管理

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "syntaxseed-api",
      script: "./server/start.js",
      cwd: "/var/www/syntaxseed",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 7204,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      max_memory_restart: "1G",
      node_args: "--max-old-space-size=1024",
    },
  ],
};
```

```bash
# 启动应用
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

#### 5. Nginx 配置

```nginx
# /etc/nginx/sites-available/syntaxseed
server {
    listen 80;
    server_name www.syntaxseed.com syntaxseed.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.syntaxseed.com syntaxseed.com;

    # SSL 配置
    ssl_certificate /etc/letsencrypt/live/www.syntaxseed.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.syntaxseed.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # 前端静态文件
    location / {
        root /var/www/syntaxseed/client/dist;
        try_files $uri $uri/ /index.html;

        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API 代理
    location /api {
        proxy_pass http://127.0.0.1:7204;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 超时设置
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# API 子域名配置
server {
    listen 443 ssl http2;
    server_name api.syntaxseed.com;

    # SSL 配置（同上）
    ssl_certificate /etc/letsencrypt/live/api.syntaxseed.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.syntaxseed.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:7204;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/syntaxseed /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## ☁️ 云服务器部署

### 阿里云 ECS 部署

#### 1. 服务器选择和配置

```bash
# 推荐配置
# 实例规格: ecs.c6.large (2vCPU 4GB)
# 操作系统: Ubuntu 22.04 LTS
# 系统盘: 40GB ESSD
# 数据盘: 100GB ESSD
# 带宽: 10Mbps

# 安全组配置
# 入方向规则:
# HTTP: 80/80, 0.0.0.0/0
# HTTPS: 443/443, 0.0.0.0/0
# SSH: 22/22, 你的IP地址/32
# 自定义: 7204/7204, 内网IP段 (API服务)
```

#### 2. 域名和 CDN 配置

```bash
# 域名解析配置
# A记录: www.syntaxseed.com -> ECS公网IP
# A记录: api.syntaxseed.com -> ECS公网IP
# CNAME: cdn.syntaxseed.com -> CDN域名

# CDN配置
# 源站: ECS公网IP
# 回源协议: HTTPS
# 缓存规则:
#   - *.js, *.css: 缓存30天
#   - *.png, *.jpg, *.gif: 缓存7天
#   - /api/*: 不缓存
```

#### 3. 数据库和缓存

```bash
# 使用阿里云 RDS MySQL
# 规格: mysql.n2.medium.1 (1核2GB)
# 存储: 100GB SSD
# 版本: MySQL 8.0

# 使用阿里云 Redis
# 规格: redis.master.micro.default (1GB)
# 版本: Redis 7.0

# 连接配置
DB_HOST=rm-xxxxxxxxx.mysql.rds.aliyuncs.com
DB_PORT=3306
REDIS_HOST=r-xxxxxxxxx.redis.rds.aliyuncs.com
REDIS_PORT=6379
```

### 腾讯云 CVM 部署

#### 1. 服务器和网络配置

```bash
# 推荐配置
# 实例类型: 标准型S5 (2核4GB)
# 操作系统: Ubuntu Server 22.04 LTS
# 系统盘: 50GB 高性能云硬盘
# 数据盘: 100GB 高性能云硬盘
# 网络: 按流量计费 10Mbps

# 安全组配置
# 入站规则:
# HTTP: TCP:80, 来源:0.0.0.0/0
# HTTPS: TCP:443, 来源:0.0.0.0/0
# SSH: TCP:22, 来源:你的IP
# 自定义: TCP:7204, 来源:内网
```

#### 2. 对象存储配置

```bash
# 使用腾讯云 COS 存储静态资源
# 存储桶: syntaxseed-static
# 访问权限: 公有读私有写
# CDN 加速: 开启

# 上传脚本
#!/bin/bash
# scripts/upload-static.sh

# 安装 COS CLI
pip install coscmd

# 配置 COS
coscmd config -a your-secret-id -s your-secret-key -b syntaxseed-static-1234567890 -r ap-beijing

# 上传静态资源
cd client/dist
coscmd upload -r . /
```

### AWS EC2 部署

#### 1. EC2 实例配置

```bash
# 实例类型: t3.medium (2vCPU 4GB)
# AMI: Ubuntu Server 22.04 LTS
# 存储: 30GB gp3 根卷 + 100GB gp3 数据卷
# 安全组: 允许 HTTP(80), HTTPS(443), SSH(22)

# 弹性IP配置
# 分配弹性IP并关联到实例
# 配置Route 53域名解析
```

#### 2. RDS 和 ElastiCache 配置

```bash
# RDS MySQL 配置
# 引擎: MySQL 8.0
# 实例类: db.t3.micro
# 存储: 100GB gp2
# 多可用区: 是

# ElastiCache Redis 配置
# 引擎: Redis 7.0
# 节点类型: cache.t3.micro
# 副本数: 1

# 环境变量配置
DB_HOST=syntaxseed.xxxxxxxxx.rds.amazonaws.com
REDIS_HOST=syntaxseed.xxxxxx.cache.amazonaws.com
```

## 🚀 CDN 配置

### 阿里云 CDN 配置

```bash
# CDN 域名配置
# 加速域名: cdn.syntaxseed.com
# 源站类型: IP
# 源站地址: ECS公网IP
# 端口: 443
# 协议: HTTPS

# 缓存配置
# 目录: /static/* 缓存时间: 30天
# 文件: *.js,*.css 缓存时间: 7天
# 文件: *.png,*.jpg,*.gif 缓存时间: 30天
# 目录: /api/* 缓存时间: 不缓存

# 压缩配置
# 智能压缩: 开启
# Brotli压缩: 开启
# Gzip压缩: 开启

# HTTPS 配置
# HTTPS 证书: 免费证书
# 强制跳转: HTTP -> HTTPS
# HTTP/2: 开启
```

### 腾讯云 CDN 配置

```javascript
// 前端构建配置
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash].[ext]",
        chunkFileNames: "js/[name].[hash].js",
        entryFileNames: "js/[name].[hash].js",
      },
    },
  },
  define: {
    __CDN_URL__: JSON.stringify("https://cdn.syntaxseed.com"),
  },
});
```

### CloudFlare CDN 配置

```bash
# DNS 配置
# A记录: syntaxseed.com -> 源站IP (橙色云朵)
# CNAME: www -> syntaxseed.com (橙色云朵)
# CNAME: api -> syntaxseed.com (灰色云朵)

# 页面规则
# *.syntaxseed.com/api/*
#   - 缓存级别: 绕过
#   - 安全级别: 高
# *.syntaxseed.com/static/*
#   - 缓存级别: 缓存所有内容
#   - 边缘缓存TTL: 1个月
#   - 浏览器缓存TTL: 1年

# SSL/TLS 配置
# 加密模式: 完全(严格)
# 最低TLS版本: 1.2
# 机会性加密: 开启
# TLS 1.3: 开启
```

## 📊 监控与维护

### 应用监控

#### PM2 监控

```bash
# PM2 监控命令
pm2 monit                    # 实时监控
pm2 status                   # 查看状态
pm2 logs                     # 查看日志
pm2 logs --lines 100         # 查看最近100行日志

# 性能监控
pm2 install pm2-server-monit # 安装监控模块

# 自动重启配置
pm2 start ecosystem.config.js --watch --ignore-watch="logs node_modules"
```

#### 系统监控脚本

```bash
#!/bin/bash
# scripts/monitor.sh

# 检查服务状态
check_service() {
    local service=$1
    if systemctl is-active --quiet $service; then
        echo "✅ $service is running"
    else
        echo "❌ $service is not running"
        systemctl restart $service
    fi
}

# 检查端口
check_port() {
    local port=$1
    local service=$2
    if netstat -tuln | grep -q ":$port "; then
        echo "✅ $service (port $port) is listening"
    else
        echo "❌ $service (port $port) is not listening"
    fi
}

# 检查磁盘空间
check_disk() {
    local usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $usage -gt 80 ]; then
        echo "⚠️  Disk usage is ${usage}%"
    else
        echo "✅ Disk usage is ${usage}%"
    fi
}

# 检查内存使用
check_memory() {
    local usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ $usage -gt 80 ]; then
        echo "⚠️  Memory usage is ${usage}%"
    else
        echo "✅ Memory usage is ${usage}%"
    fi
}

echo "🔍 System Health Check - $(date)"
echo "================================"

check_service nginx
check_service mysql
check_service redis-server

check_port 80 "Nginx HTTP"
check_port 443 "Nginx HTTPS"
check_port 7204 "Node.js API"
check_port 3306 "MySQL"
check_port 6379 "Redis"

check_disk
check_memory

# 检查 PM2 进程
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "🔚 Health check completed"
```

### 日志管理

#### 日志轮转配置

```bash
# /etc/logrotate.d/syntaxseed
/var/www/syntaxseed/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}

# 测试配置
sudo logrotate -d /etc/logrotate.d/syntaxseed
```

#### 日志分析脚本

```bash
#!/bin/bash
# scripts/log-analysis.sh

LOG_DIR="/var/www/syntaxseed/logs"
DATE=$(date +%Y-%m-%d)

echo "📊 日志分析报告 - $DATE"
echo "========================"

# API 请求统计
echo "🌐 API 请求统计:"
grep "$(date +%Y-%m-%d)" $LOG_DIR/access.log | \
awk '{print $7}' | \
sort | uniq -c | sort -nr | head -10

# 错误统计
echo ""
echo "❌ 错误统计:"
grep "ERROR" $LOG_DIR/error.log | \
grep "$(date +%Y-%m-%d)" | \
wc -l

# 响应时间分析
echo ""
echo "⏱️  平均响应时间:"
grep "$(date +%Y-%m-%d)" $LOG_DIR/access.log | \
awk '{sum+=$10; count++} END {print sum/count "ms"}'

# 用户访问统计
echo ""
echo "👥 独立访客数:"
grep "$(date +%Y-%m-%d)" $LOG_DIR/access.log | \
awk '{print $1}' | sort | uniq | wc -l
```

### 备份策略

#### 数据库备份

```bash
#!/bin/bash
# scripts/backup-database.sh

BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="syntaxseed"
DB_USER="syntaxseed"
DB_PASS="your-password"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 数据库备份
mysqldump -u$DB_USER -p$DB_PASS \
    --single-transaction \
    --routines \
    --triggers \
    $DB_NAME > $BACKUP_DIR/syntaxseed_$DATE.sql

# 压缩备份文件
gzip $BACKUP_DIR/syntaxseed_$DATE.sql

# 删除7天前的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "✅ 数据库备份完成: syntaxseed_$DATE.sql.gz"
```

#### 文件备份

```bash
#!/bin/bash
# scripts/backup-files.sh

BACKUP_DIR="/backup/files"
APP_DIR="/var/www/syntaxseed"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份应用文件
tar -czf $BACKUP_DIR/syntaxseed_files_$DATE.tar.gz \
    --exclude='node_modules' \
    --exclude='logs' \
    --exclude='.git' \
    $APP_DIR

# 删除30天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "✅ 文件备份完成: syntaxseed_files_$DATE.tar.gz"
```

#### 自动备份配置

```bash
# 添加到 crontab
crontab -e

# 每天凌晨2点备份数据库
0 2 * * * /var/www/syntaxseed/scripts/backup-database.sh

# 每周日凌晨3点备份文件
0 3 * * 0 /var/www/syntaxseed/scripts/backup-files.sh

# 每天凌晨4点执行健康检查
0 4 * * * /var/www/syntaxseed/scripts/monitor.sh >> /var/log/health-check.log
```

## 🔧 故障排除

### 常见问题诊断

#### 服务无法启动

```bash
# 检查端口占用
sudo netstat -tulpn | grep :7204
sudo lsof -i :7204

# 检查进程状态
pm2 status
pm2 logs syntaxseed-api --lines 50

# 检查系统资源
free -h
df -h
top
```

#### 数据库连接问题

```bash
# 测试数据库连接
mysql -h localhost -u syntaxseed -p syntaxseed

# 检查 MySQL 状态
sudo systemctl status mysql
sudo journalctl -u mysql -f

# 检查 MySQL 配置
sudo mysql -u root -p -e "SHOW VARIABLES LIKE 'max_connections';"
sudo mysql -u root -p -e "SHOW PROCESSLIST;"
```

#### Redis 连接问题

```bash
# 测试 Redis 连接
redis-cli -h localhost -p 6379 -a your-password ping

# 检查 Redis 状态
sudo systemctl status redis-server
redis-cli info memory
redis-cli info clients
```

#### Nginx 配置问题

```bash
# 测试 Nginx 配置
sudo nginx -t

# 重新加载配置
sudo nginx -s reload

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 检查访问日志
sudo tail -f /var/log/nginx/access.log
```

### 性能优化

#### 数据库优化

```sql
-- 查看慢查询
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- 分析表性能
ANALYZE TABLE blog_posts;
ANALYZE TABLE users;

-- 添加索引
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX idx_users_email ON users(email);
```

#### Redis 优化

```bash
# Redis 配置优化
# /etc/redis/redis.conf

# 内存优化
maxmemory 512mb
maxmemory-policy allkeys-lru

# 持久化优化
save 900 1
save 300 10
save 60 10000

# 网络优化
tcp-keepalive 300
timeout 0
```

#### Node.js 优化

```javascript
// server/start.js
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Workers can share any TCP port
  require("./index.js");
  console.log(`Worker ${process.pid} started`);
}
```

### 安全加固

#### 系统安全

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 配置防火墙
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# 禁用 root 登录
sudo vim /etc/ssh/sshd_config
# PermitRootLogin no
# PasswordAuthentication no

# 安装 fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

#### 应用安全

```javascript
// server/middleware/security.js
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// 安全头
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// 频率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP",
});

app.use("/api", limiter);
```

---

## 📞 技术支持

如果在部署过程中遇到问题，请：

1. 查看相关日志文件
2. 检查环境配置是否正确
3. 参考故障排除章节
4. 在 GitHub Issues 中搜索相似问题
5. 创建新的 Issue 并提供详细信息

**联系方式：**

- 📧 邮箱：support@syntaxseed.com
- 💬 QQ 群：123456789
- 📖 文档：https://docs.syntaxseed.com

---

_最后更新：2024 年 1 月_
