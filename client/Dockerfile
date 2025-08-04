# 基础镜像
FROM node:22-alpine AS base
WORKDIR /app
RUN npm i -g pnpm
COPY package*.json ./
RUN pnpm install

# 开发环境
FROM base AS development
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]

# 测试环境
FROM base AS test
COPY . .
RUN pnpm run build
FROM nginx:stable-alpine AS test-runtime
COPY --from=test /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# 构建阶段
FROM base AS build-stage

# 接收构建参数
ARG VITE_API_BASEURL=/api
ARG VITE_staticHost=./
ENV VITE_API_BASEURL=${VITE_API_BASEURL}
ENV VITE_staticHost=${VITE_staticHost}
COPY . .
RUN pnpm run build

# 生产环境
FROM nginx:stable-alpine AS production

# 安装必要工具
RUN apk add --no-cache bash

# 复制构建产物
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制启动脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

# 使用自定义启动脚本
ENTRYPOINT ["/docker-entrypoint.sh"]