# 头像自定义配置指南

## 概述

SyntaxSeed 支持多种方式自定义个人头像，适用于不同的部署场景。

## 方法一：环境变量配置（推荐）

### 本地开发

1. 编辑 `client/.env.development` 文件：

```bash
# 使用本地文件
VITE_AVATAR_URL=/custom-avatar.jpg

# 或使用远程 URL
VITE_AVATAR_URL=https://your-domain.com/avatar.jpg
```

2. 将头像文件放到 `client/public/custom-avatar.jpg`

### 生产部署

1. 编辑 `client/.env.production` 文件：

```bash
VITE_AVATAR_URL=https://cdn.example.com/avatar.jpg
```

2. 重新构建项目：

```bash
cd client
pnpm build
```

## 方法二：Docker 部署自定义

### 使用环境变量

1. 创建 `.env` 文件：

```bash
# 设置头像 URL
AVATAR_URL=https://your-cdn.com/avatar.jpg
```

2. 启动容器：

```bash
docker-compose -f docker-compose.prod.simple.yml up -d
```

### 使用文件挂载

1. 创建自定义资源目录：

```bash
mkdir -p custom-assets
```

2. 将你的头像文件复制到该目录：

```bash
cp your-avatar.jpg custom-assets/avatar.jpg
```

3. 启动容器（已在 docker-compose.yml 中配置挂载）：

```bash
docker-compose -f docker-compose.prod.simple.yml up -d
```

## 方法三：替换默认头像

直接替换项目中的默认头像文件：

```bash
# 备份原文件
cp client/src/assets/head.jpg client/src/assets/head.jpg.backup

# 替换为你的头像
cp your-avatar.jpg client/src/assets/head.jpg

# 重新构建
cd client
pnpm build
```

## 头像要求

- **格式**：支持 JPG、PNG、WebP
- **尺寸**：建议 512x512 像素或更高
- **比例**：1:1 正方形（会自动裁剪为圆形）
- **大小**：建议小于 500KB

## 故障排除

### 头像不显示

1. 检查文件路径是否正确
2. 确认文件权限（Docker 部署时）
3. 检查网络连接（远程 URL）
4. 查看浏览器控制台错误信息

### Docker 部署问题

1. 确认挂载路径正确：

```bash
docker exec -it <container_name> ls -la /usr/share/nginx/html/
```

2. 检查环境变量：

```bash
docker exec -it <container_name> env | grep AVATAR
```

## 示例配置

### CDN 配置

```bash
VITE_AVATAR_URL=https://cdn.jsdelivr.net/gh/username/repo@main/avatar.jpg
```

### 本地静态文件

```bash
VITE_AVATAR_URL=/static/images/avatar.jpg
```

### Base64 内联（小文件）

```bash
VITE_AVATAR_URL=data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...
```
