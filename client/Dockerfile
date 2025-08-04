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
COPY . .
RUN pnpm run build

# 生产环境
FROM nginx:stable-alpine AS production
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]