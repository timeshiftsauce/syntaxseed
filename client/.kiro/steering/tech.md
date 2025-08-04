# Technology Stack

## Frontend Stack

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite 6.x
- **Language**: JavaScript/TypeScript
- **CSS Framework**: Tailwind CSS 3.x
- **UI Components**:
  - PrimeVue 4.x (primary UI library)
  - Element Plus 2.x (additional components)
- **State Management**: Pinia
- **Routing**: Vue Router 4.x
- **HTTP Client**: Axios
- **Code Highlighting**: Prism.js
- **Markdown**: Marked
- **Icons**: PrimeIcons, Unplugin Icons
- **Fonts**: Google Fonts (Montserrat, Open Sans, Fira Code)

## Backend Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MySQL 8.0+ with Knex.js query builder
- **Authentication**: JWT + bcryptjs
- **Session Management**: express-session
- **Email**: Nodemailer
- **Logging**: Winston
- **Process Management**: PM2 (production)
- **Rate Limiting**: express-rate-limit
- **CORS**: cors middleware

## Development Tools

- **Package Manager**: pnpm (preferred)
- **Linting**: ESLint 9.x with TypeScript support
- **Formatting**: Prettier
- **Auto-imports**: unplugin-auto-import, unplugin-vue-components
- **Dev Tools**: Vue DevTools, Vite DevTools

## Build & Development Commands

### Frontend Commands

```bash
# Development
pnpm dev                 # Start dev server on port 3000
pnpm build              # Build for production
pnpm preview            # Preview production build
pnpm type-check         # TypeScript type checking
pnpm lint               # Lint and fix code
pnpm format             # Format code with Prettier

# SEO Tools
pnpm seo:generate       # Generate SEO files
pnpm seo:check          # Check SEO compliance
```

### Backend Commands

```bash
# In serves/ directory
pnpm dev                # Development with nodemon
pnpm start              # Production start
pnpm start:cluster      # Start with cluster mode
pnpm start:single       # Start single process
pnpm test:cluster       # Test cluster functionality
pnpm benchmark          # Run performance benchmarks
pnpm config             # Check configuration
pnpm status             # Check cluster status
```

## Configuration Files

- **Vite**: `vite.config.ts` - Build configuration with auto-imports
- **Tailwind**: `tailwind.config.js` - Custom theme with ocean blue palette
- **ESLint**: `eslint.config.ts` - Flat config with Vue/TS support
- **TypeScript**: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- **Environment**: `.env.development`, `.env.production`

## Deployment

- **Frontend**: Static files served via Nginx
- **Backend**: PM2 process manager with cluster mode
- **Database**: MySQL with connection pooling
- **Proxy**: Nginx reverse proxy for API routes (/api)
- **SSL**: HTTPS with certificate configuration
