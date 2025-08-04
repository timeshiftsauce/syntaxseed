# SyntaxSeed Docker 部署指南

## 🚀 快速开始

### 1. 修改 Registry 配置

编辑构建脚本，将 `your-registry.com` 替换为你的实际 Registry 地址：

- **Docker Hub**: 使用你的用户名，如 `username`
- **阿里云**: 使用 `registry.cn-hangzhou.aliyuncs.com/your-namespace`
- **私有 Registry**: 使用完整域名，如 `registry.example.com`

### 2. 登录 Docker Registry

```bash
# Docker Hub
docker login

# 阿里云
docker login --username=your-username registry.cn-hangzhou.aliyuncs.com

# 私有 Registry
docker login your-registry.com
```

### 3. 构建和推送镜像

**Windows:**

```cmd
# 使用默认配置
build-and-push.bat

# 指定 Registry 和版本
build-and-push.bat registry.cn-hangzhou.aliyuncs.com/syntaxseed v1.0.0
```

**Linux/macOS:**

```bash
# 使用默认配置
./build-and-push.sh

# 指定 Registry 和版本
./build-and-push.sh registry.cn-hangzhou.aliyuncs.com/syntaxseed v1.0.0
```

### 4. 部署到生产环境

**Windows:**

```cmd
# 使用默认配置
deploy.bat

# 指定 Registry 和版本
deploy.bat registry.cn-hangzhou.aliyuncs.com/syntaxseed v1.0.0
```

**Linux/macOS:**

```bash
# 使用默认配置
./deploy.sh

# 指定 Registry 和版本
./deploy.sh registry.cn-hangzhou.aliyuncs.com/syntaxseed v1.0.0
```

## 📋 创建的文件

- `build-and-push.sh` / `build-and-push.bat` - 构建和推送脚本
- `deploy.sh` / `deploy.bat` - 部署脚本
- `docker-compose.registry.yml` - Registry 镜像部署配置
- `DOCKER_REGISTRY_GUIDE.md` - 详细使用指南

## 🔧 服务访问

部署成功后，可以通过以下地址访问：

- **前端**: http://localhost:8080
- **后端 API**: http://localhost:7204
- **MySQL**: localhost:3307
- **Redis**: localhost:6379

## 📝 常用命令

```bash
# 查看服务状态
docker-compose -f docker-compose.registry.yml ps

# 查看日志
docker-compose -f docker-compose.registry.yml logs -f

# 重启服务
docker-compose -f docker-compose.registry.yml restart

# 停止服务
docker-compose -f docker-compose.registry.yml down
```

## ⚠️ 注意事项

1. **首次使用前**，请修改脚本中的 `DEFAULT_REGISTRY` 为你的实际 Registry 地址
2. **生产环境**，建议修改默认密码和密钥
3. **网络安全**，确保只暴露必要的端口

更多详细信息请查看 `DOCKER_REGISTRY_GUIDE.md`。
