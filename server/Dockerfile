# 基础镜像
FROM node:22-alpine AS base

# 安装必要的系统依赖
RUN apk add --no-cache curl dumb-init

WORKDIR /app

# 先复制依赖文件以利用 Docker 缓存
COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm install
RUN npm i -g pm2

# 开发环境
FROM base AS development

# 复制源代码
COPY . .

# 创建日志目录
RUN mkdir -p logs

# 设置开发环境变量
ENV NODE_ENV=development
ENV PORT=7204
ENV LOG_LEVEL=debug
ENV LOG_FILE_ENABLED=false

# 暴露端口
EXPOSE 7204

# 开发模式使用 nodemon
CMD ["pnpm", "dev"]

# 测试环境
FROM base AS test

# 复制源代码
COPY . .

# 创建日志目录
RUN mkdir -p logs

# 设置测试环境变量
ENV NODE_ENV=test
ENV PORT=7204
ENV LOG_LEVEL=warn
ENV LOG_FILE_ENABLED=false

# 暴露端口
EXPOSE 7204

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=2 \
  CMD curl -f http://localhost:${PORT}/api/health || exit 1

# 测试环境使用单进程模式
CMD ["dumb-init", "node", "index.js"]

# 生产环境
FROM base AS production

# 复制源代码
COPY --chown=node:node . .

# 创建日志目录和设置权限
RUN mkdir -p logs && \
    chown -R node:node /app && \
    chmod -R 755 /app && \
    chmod 777 logs

# 切换到非 root 用户
USER node


# 确保环境变量在运行时可用
ENV PATH=/usr/local/bin:$PATH

# 暴露端口
EXPOSE 7204

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${PORT}/api/health || exit 1

# 使用 dumb-init 和 PM2 运行应用
CMD ["dumb-init", "pm2-runtime", "start", "ecosystem.config.js"]