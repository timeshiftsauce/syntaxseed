# Technology Stack & Build System

## Architecture

Full-stack application with separate frontend, backend, and admin dashboard components.

## Frontend (Client)

- **Framework**: Vue 3.5+ with Composition API
- **Build Tool**: Vite 6.0+
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4+
- **UI Components**:
  - PrimeVue 4.3+ (primary UI library)
  - Element Plus 2.10+ (additional components)
- **State Management**: Pinia 3.0+
- **Routing**: Vue Router 4.5+
- **HTTP Client**: Axios 1.11+
- **Code Highlighting**: Prism.js 1.30+
- **Markdown**: Marked 16.1+
- **Utilities**: @vueuse/core, DOMPurify

## Backend (Server)

- **Runtime**: Node.js
- **Framework**: Express 5.1+
- **Database**: MySQL 8.0+ with Knex.js query builder
- **Caching**: Redis 7+ with ioredis client
- **Authentication**: JWT with bcryptjs
- **Session Management**: express-session
- **Rate Limiting**: express-rate-limit
- **Logging**: Winston
- **Email**: Nodemailer
- **Process Management**: PM2 (production)

## Admin Dashboard

- **Framework**: BuildAdmin (Vue3 + ThinkPHP8 based)
- **Features**: CRUD code generation, web terminal, module marketplace

## Development Tools

- **Package Manager**: pnpm (preferred)
- **Linting**: ESLint 9+ with TypeScript support
- **Formatting**: Prettier 3.6+
- **Type Checking**: vue-tsc
- **Development**: Nodemon for server hot reload

## Common Commands

### Root Level

```bash
# Install all dependencies
pnpm install

# Start both client and server in development
pnpm dev

# Start only client
pnpm dev:client

# Start only server
pnpm dev:server
```

### Client Commands

```bash
cd client

# Development server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm type-check

# Linting and formatting
pnpm lint
pnpm format

# SEO file generation
pnpm seo:generate
```

### Server Commands

```bash
cd server

# Development with nodemon
pnpm dev

# Production start
pnpm start

# Cluster mode
pnpm start:cluster
```

## Environment Configuration

- Client: `.env.development` and `.env.production` files
- Server: Environment variables for database, Redis, JWT secrets
- Docker: Full containerization with docker-compose.yml

## Database

- MySQL 8.0+ with utf8mb4 charset
- Knex.js for query building and migrations
- Redis for caching and session storage
