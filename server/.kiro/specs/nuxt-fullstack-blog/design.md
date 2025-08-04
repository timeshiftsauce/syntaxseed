# 设计文档

## 概述

本项目将创建一个基于Nuxt.js的全栈博客系统，整合现有的Express.js后端API到Nuxt的server目录中，实现真正的全栈应用。项目采用现代化的技术栈，提供优秀的用户体验、SEO优化和管理功能。

## 架构

### 整体架构

```mermaid
graph TB
    A[用户浏览器] --> B[Nuxt.js 前端]
    B --> C[Nuxt Server API]
    C --> D[数据库层]
    C --> E[缓存层]
    C --> F[文件存储]

    D --> D1[MySQL 数据库]
    E --> E1[Redis 缓存]
    F --> F1[本地文件系统/CDN]

    B --> B1[页面组件]
    B --> B2[布局组件]
    B --> B3[UI组件库]

    C --> C1[认证中间件]
    C --> C2[限流中间件]
    C --> C3[日志中间件]
```

### 技术栈选择

#### 前端技术栈

- **Nuxt.js 3**: 基于Vue 3的全栈框架，提供SSR/SSG支持
- **Vue 3**: 现代化的前端框架，支持Composition API
- **TypeScript**: 类型安全的JavaScript超集
- **GSAP**: 高性能动画库，用于页面动画和交互效果
- **SCSS**: CSS预处理器，提供更强大的样式编写能力
- **Element Plus**: Vue 3的UI组件库，提供丰富的组件
- **PrimeVue**: 另一个Vue 3 UI库，补充特殊组件需求
- **Pinia**: Vue 3的状态管理库
- **VueUse**: Vue 3的工具函数库

#### 后端技术栈

- **Nuxt Server API**: Nuxt 3内置的服务端API功能
- **Prisma**: 现代化的ORM，替代Knex.js
- **MySQL**: 关系型数据库
- **Redis**: 内存缓存数据库
- **JWT**: JSON Web Token认证
- **Nodemailer**: 邮件发送服务
- **Multer**: 文件上传处理

#### 开发工具

- **pnpm**: 高效的包管理器
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Husky**: Git hooks管理

## 组件和接口

### 前端组件架构

#### 页面组件 (Pages)

```
pages/
├── index.vue                 # 首页
├── blog/
│   ├── index.vue            # 博客列表页
│   └── [id].vue             # 博客详情页
├── projects/
│   └── index.vue            # 项目展示页
├── timeline/
│   └── index.vue            # 时间线页面
├── auth/
│   ├── login.vue            # 登录页
│   └── register.vue         # 注册页
└── admin/
    ├── index.vue            # 管理后台首页
    ├── blogs/
    │   ├── index.vue        # 博客管理
    │   └── edit/[id].vue    # 博客编辑
    ├── comments/
    │   └── index.vue        # 评论管理
    └── users/
        └── index.vue        # 用户管理
```

#### 布局组件 (Layouts)

```
layouts/
├── default.vue              # 默认布局
├── admin.vue                # 管理后台布局
└── auth.vue                 # 认证页面布局
```

#### 通用组件 (Components)

```
components/
├── common/
│   ├── Header.vue           # 网站头部
│   ├── Footer.vue           # 网站底部
│   ├── Navigation.vue       # 导航菜单
│   ├── Loading.vue          # 加载动画
│   └── BackToTop.vue        # 返回顶部
├── blog/
│   ├── BlogCard.vue         # 博客卡片
│   ├── BlogList.vue         # 博客列表
│   ├── BlogDetail.vue       # 博客详情
│   ├── BlogTags.vue         # 博客标签
│   └── BlogSearch.vue       # 博客搜索
├── comment/
│   ├── CommentList.vue      # 评论列表
│   ├── CommentItem.vue      # 评论项
│   └── CommentForm.vue      # 评论表单
├── project/
│   ├── ProjectCard.vue      # 项目卡片
│   └── ProjectGrid.vue      # 项目网格
├── timeline/
│   ├── TimelineItem.vue     # 时间线项
│   └── TimelineChart.vue    # 时间线图表
├── ui/
│   ├── Button.vue           # 自定义按钮
│   ├── Input.vue            # 自定义输入框
│   ├── Modal.vue            # 模态框
│   └── Pagination.vue       # 分页组件
└── animation/
    ├── TypeWriter.vue       # 打字机效果
    ├── ScrollReveal.vue     # 滚动显示动画
    └── ParallaxSection.vue  # 视差滚动
```

### 后端API架构

#### Server API结构

```
server/
├── api/
│   ├── config.get.ts        # 获取网站配置
│   ├── typewriter-texts.get.ts # 获取打字机文本
│   ├── projects.get.ts      # 获取项目列表
│   ├── blogs/
│   │   ├── index.get.ts     # 获取博客列表
│   │   ├── [id].get.ts      # 获取博客详情
│   │   └── tags.get.ts      # 获取博客标签
│   ├── tech-stack.get.ts    # 获取技术栈
│   ├── timelines.get.ts     # 获取时间线
│   ├── comments/
│   │   ├── index.get.ts     # 获取评论列表
│   │   ├── index.post.ts    # 提交评论
│   │   └── count/[blogId].get.ts # 获取评论数量
│   ├── auth/
│   │   ├── captcha.get.ts   # 获取验证码
│   │   ├── send-email-code.post.ts # 发送邮箱验证码
│   │   ├── register.post.ts # 用户注册
│   │   ├── login.post.ts    # 用户登录
│   │   ├── refresh-token.post.ts # 刷新令牌
│   │   ├── logout.post.ts   # 用户登出
│   │   ├── user-info.get.ts # 获取用户信息
│   │   └── user-info.put.ts # 更新用户信息
│   └── admin/
│       └── comments/
│           ├── [id]/status.put.ts # 审核评论
│           └── [id].delete.ts     # 删除评论
├── middleware/
│   ├── auth.ts              # 认证中间件
│   ├── admin.ts             # 管理员权限中间件
│   ├── rateLimit.ts         # 限流中间件
│   └── cors.ts              # CORS中间件
└── utils/
    ├── database.ts          # 数据库连接
    ├── redis.ts             # Redis连接
    ├── jwt.ts               # JWT工具
    ├── email.ts             # 邮件服务
    ├── captcha.ts           # 验证码生成
    └── validation.ts        # 数据验证
```

## 数据模型

### 数据库设计 (Prisma Schema)

```prisma
// 网站配置表
model Config {
  id              Int      @id @default(autoincrement())
  minTitle        String   @map("min_title")
  title           String
  link            String
  uploadCdnUrl    String   @map("upload_cdn_url")
  recordNumber    String   @map("record_number")
  introduction    String
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("ba_config")
}

// 打字机文本表
model TypewriterText {
  id        Int      @id @default(autoincrement())
  text      String
  order     Int      @default(0)
  status    Int      @default(1)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("ba_typewritertexts")
}

// 项目表
model Project {
  id          Int      @id @default(autoincrement())
  title       String
  description String   @db.Text
  tags        Json
  images      Json
  image       String?
  features    Json
  techStack   Json     @map("tech_stack")
  weight      Int      @default(0)
  status      Int      @default(1)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("ba_project")
}

// 博客文章表
model BlogDetail {
  id         String    @id @default(cuid())
  title      String
  content    String    @db.LongText
  excerpt    String?   @db.Text
  image      String?
  tags       Json
  readTime   String?   @map("read_time")
  status     Int       @default(1)
  createdAt  DateTime  @default(now()) @map("created_at")
  updatedAt  DateTime  @updatedAt @map("updated_at")

  // 关联评论
  comments   Comment[]

  @@map("ba_blogdetail")
}

// 时间线表
model Timeline {
  id           Int      @id @default(autoincrement())
  year         Int
  title        String
  description  String   @db.Text
  date         String
  technologies Json
  skills       Json
  status       Int      @default(1)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("ba_timeline")
}

// 技术栈表
model TechStack {
  id        Int      @id @default(autoincrement())
  name      String
  level     Int
  category  String
  icon      String?
  status    Int      @default(1)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("ba_tech_stack")
}

// 评论表
model Comment {
  id        String    @id @default(cuid())
  blogId    String    @map("blog_id")
  author    String
  email     String
  website   String?
  content   String    @db.Text
  avatar    String?
  parentId  String?   @map("parent_id")
  status    Int       @default(0) // 0: 待审核, 1: 已通过
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  // 关联博客文章
  blog      BlogDetail @relation(fields: [blogId], references: [id], onDelete: Cascade)

  // 自关联 - 回复功能
  parent    Comment?   @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[]  @relation("CommentReplies")

  @@map("ba_comments")
}

// 用户表
model BlogUser {
  id          Int      @id @default(autoincrement())
  name        String
  email       String   @unique
  phone       String?
  password    String
  role        String   @default("user") // user, admin
  status      Int      @default(1)
  registTime  DateTime @default(now()) @map("regist_time")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("ba_blog_user")
}

// JWT刷新令牌表
model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    Int      @map("user_id")
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("refresh_tokens")
}
```

### Redis缓存策略

```typescript
// 缓存键命名规范
const CACHE_KEYS = {
  CONFIG: "config",
  TYPEWRITER_TEXTS: "typewriter_texts",
  PROJECTS: "projects",
  BLOGS: (page: number, limit: number, keywords?: string) =>
    `blogs:${page}:${limit}:${keywords || "all"}`,
  BLOG_DETAIL: (id: string) => `blog:${id}`,
  BLOG_TAGS: "blog_tags",
  TECH_STACK: "tech_stack",
  TIMELINES: "timelines",
  COMMENTS: (blogId: string, page: number, limit: number) =>
    `comments:${blogId}:${page}:${limit}`,
  COMMENT_COUNT: (blogId: string) => `comment_count:${blogId}`,
  CAPTCHA: (id: string) => `captcha:${id}`,
  EMAIL_CODE: (email: string, type: string) => `email_code:${email}:${type}`,
  RATE_LIMIT: (ip: string, endpoint: string) => `rate_limit:${ip}:${endpoint}`,
};

// 缓存过期时间
const CACHE_TTL = {
  CONFIG: 3600, // 1小时
  TYPEWRITER_TEXTS: 3600, // 1小时
  PROJECTS: 1800, // 30分钟
  BLOGS: 600, // 10分钟
  BLOG_DETAIL: 1800, // 30分钟
  BLOG_TAGS: 3600, // 1小时
  TECH_STACK: 3600, // 1小时
  TIMELINES: 3600, // 1小时
  COMMENTS: 300, // 5分钟
  COMMENT_COUNT: 300, // 5分钟
  CAPTCHA: 120, // 2分钟
  EMAIL_CODE: 300, // 5分钟
  RATE_LIMIT: 60, // 1分钟
};
```

## 错误处理

### 统一错误处理机制

```typescript
// 错误类型定义
export enum ErrorCode {
  // 通用错误
  INTERNAL_ERROR = 500,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,

  // 业务错误
  INVALID_CREDENTIALS = 1001,
  EMAIL_ALREADY_EXISTS = 1002,
  INVALID_EMAIL_CODE = 1003,
  INVALID_CAPTCHA = 1004,
  COMMENT_PENDING_APPROVAL = 1005,
  BLOG_NOT_FOUND = 1006,
  PROJECT_NOT_FOUND = 1007,
}

// 错误响应格式
interface ErrorResponse {
  success: false;
  code: number;
  message: string;
  details?: any;
}

// 成功响应格式
interface SuccessResponse<T = any> {
  success?: true;
  code: number;
  data?: T;
  total?: number;
  page?: number;
  limit?: number;
  spendTime?: string;
  message?: string;
}
```

### 前端错误处理

```typescript
// 全局错误处理插件
export default defineNuxtPlugin(() => {
  // API错误拦截
  $fetch.create({
    onResponseError({ response }) {
      const error = response._data;

      // 根据错误类型显示不同的提示
      if (error.code === 401) {
        // 未授权，跳转到登录页
        navigateTo("/auth/login");
      } else if (error.code === 429) {
        // 请求过于频繁
        ElMessage.error("请求过于频繁，请稍后再试");
      } else {
        // 其他错误
        ElMessage.error(error.message || "请求失败");
      }
    },
  });
});
```

## 测试策略

### 测试框架选择

- **Vitest**: 快速的单元测试框架
- **@vue/test-utils**: Vue组件测试工具
- **Playwright**: 端到端测试框架
- **MSW**: API模拟测试

### 测试覆盖范围

#### 单元测试

- 工具函数测试
- 组件逻辑测试
- API路由测试
- 数据验证测试

#### 集成测试

- 数据库操作测试
- 认证流程测试
- 缓存机制测试
- 邮件发送测试

#### 端到端测试

- 用户注册登录流程
- 博客浏览和评论功能
- 管理后台操作流程
- 响应式设计测试

### 测试配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: "nuxt",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", ".nuxt/", "coverage/", "**/*.d.ts"],
    },
  },
});
```

## 性能优化策略

### 前端性能优化

#### 代码分割和懒加载

```typescript
// 路由级别的代码分割
const BlogDetail = defineAsyncComponent(() => import("~/pages/blog/[id].vue"));

// 组件级别的懒加载
const AdminPanel = defineAsyncComponent(
  () => import("~/components/admin/AdminPanel.vue"),
);
```

#### 图片优化

```vue
<template>
  <!-- 使用Nuxt Image进行图片优化 -->
  <NuxtImg
    :src="blog.image"
    :alt="blog.title"
    format="webp"
    quality="80"
    loading="lazy"
    sizes="sm:100vw md:50vw lg:400px"
  />
</template>
```

#### 缓存策略

```typescript
// 页面级缓存
export default defineNuxtConfig({
  routeRules: {
    "/": { prerender: true },
    "/blog/**": { isr: 60 }, // 增量静态再生，60秒
    "/projects": { prerender: true },
    "/admin/**": { ssr: false }, // SPA模式
  },
});
```

### 后端性能优化

#### 数据库查询优化

```typescript
// 使用索引和查询优化
const blogs = await prisma.blogDetail.findMany({
  select: {
    id: true,
    title: true,
    excerpt: true,
    image: true,
    tags: true,
    createdAt: true,
    readTime: true,
    _count: {
      select: { comments: true },
    },
  },
  where: {
    status: 1,
    ...(keywords && {
      OR: [
        { title: { contains: keywords } },
        { excerpt: { contains: keywords } },
      ],
    }),
  },
  orderBy: { createdAt: "desc" },
  skip: (page - 1) * limit,
  take: limit,
});
```

#### Redis缓存优化

```typescript
// 缓存预热和更新策略
export async function warmupCache() {
  // 预热常用数据
  await Promise.all([
    getConfig(),
    getTypewriterTexts(),
    getProjects(),
    getTechStack(),
    getTimelines(),
  ]);
}

// 缓存失效策略
export async function invalidateCache(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
```

## 安全考虑

### 认证和授权

- JWT双令牌机制（Access Token + Refresh Token）
- 密码加密存储（bcrypt）
- 会话管理和令牌刷新
- 角色权限控制（RBAC）

### 数据验证

- 输入数据验证和清理
- SQL注入防护（Prisma ORM）
- XSS攻击防护
- CSRF攻击防护

### 限流和防护

- API请求限流
- 验证码机制
- 邮件发送限制
- IP黑名单机制

### 数据安全

- 敏感数据加密
- 数据库连接加密
- 环境变量保护
- 日志脱敏处理

## 部署架构

### 开发环境

```bash
# 启动开发服务器
pnpm dev

# 数据库迁移
pnpm prisma migrate dev

# 生成Prisma客户端
pnpm prisma generate
```

### 生产环境

```bash
# 构建应用
pnpm build

# 启动生产服务器
pnpm start

# 数据库迁移
pnpm prisma migrate deploy
```

### Docker部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

### 环境配置

```bash
# .env
DATABASE_URL="mysql://user:password@localhost:3306/blog"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
UPLOAD_DIR="./uploads"
CDN_URL="https://cdn.example.com"
```
