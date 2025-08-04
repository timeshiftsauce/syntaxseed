# 头像自定义配置指南

## 概述

SyntaxSeed 支持多种方式自定义个人头像，适用于不同的部署场景。

## 方法一：手动构建


1. 将头像文件放到 `client/public/head.jpg`

2. 重新构建项目：

```bash
cd client
pnpm build
```

## 方法二：Docker 部署自定义

### 使用环境变量

1. 替换 `/web/head.jpg` 文件（jpg格式）：

2. 启动容器：

```bash
docker-compose -f docker-compose.prod.simple.yml up -d
```


## 头像要求

- **格式**：支持 JPG （自行编译方式不限）
- **尺寸**：建议 512x512 像素或更高
- **比例**：1:1 正方形（会自动裁剪为圆形）
- **大小**：建议小于 500KB

## 故障排除

### 头像不显示

1. 检查文件路径是否正确
2. 确认文件权限（Docker 部署时）
3. 检查网络连接（远程 URL）
4. 查看浏览器控制台错误信息
