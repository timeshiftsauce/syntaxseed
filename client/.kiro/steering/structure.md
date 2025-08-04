# Project Structure

## Root Directory Layout

```
/
├── src/                 # Frontend Vue application
├── serves/              # Backend Express.js API server
├── public/              # Static assets and SEO files
├── buildadmin/          # Admin panel (Buildadmin-based CMS)
├── axios/               # HTTP client configuration
├── scripts/             # Build and utility scripts
├── docs/                # Project documentation
├── .kiro/               # Kiro AI assistant configuration
└── dist/                # Production build output
```

## Frontend Structure (`src/`)

```
src/
├── api/                 # API service layer and HTTP clients
├── assets/              # Static assets (images, styles, fonts)
├── auth/                # Authentication logic and guards
├── components/          # Reusable Vue components
├── composables/         # Vue composition functions
├── config/              # Frontend configuration files
├── data/                # Static data and mock data
├── examples/            # Example components and demos
├── router/              # Vue Router configuration
├── stores/              # Pinia state management stores
├── utils/               # Utility functions and helpers
├── views/               # Page-level Vue components
├── App.vue              # Root Vue component
└── main.js              # Application entry point
```

## Backend Structure (`serves/`)

```
serves/
├── auth/                # Authentication routes and middleware
├── config/              # Server configuration files
├── getData/             # API routes and data handlers
├── middleware/          # Express middleware (logging, rate limiting, etc.)
├── services/            # Business logic services
├── logs/                # Application logs
├── examples/            # API usage examples
├── index.js             # Main server entry point
├── db.js                # Database connection and configuration
├── db.config.yaml       # Database parameters
└── .env                 # Environment variables
```

## Key Configuration Files

### Frontend Configuration

- `vite.config.ts` - Vite build configuration with plugins
- `tailwind.config.js` - Tailwind CSS theme and utilities
- `eslint.config.ts` - ESLint rules for Vue/TypeScript
- `tsconfig.*.json` - TypeScript compiler configurations
- `components.d.ts` - Auto-generated component type definitions
- `auto-imports.d.ts` - Auto-generated import type definitions

### Backend Configuration

- `serves/db.config.yaml` - Database connection parameters
- `serves/.env` - Environment variables for backend
- `serves/package.json` - Backend dependencies and scripts

### Project-wide Configuration

- `.env.development` / `.env.production` - Environment-specific variables
- `.gitignore` - Git ignore patterns
- `.prettierrc` / `.prettierignore` - Code formatting rules
- `package.json` - Frontend dependencies and scripts

## Component Organization

### Vue Components (`src/components/`)

- Organize by feature or functionality
- Use PascalCase for component names
- Include both PrimeVue and Element Plus components
- Auto-imported via unplugin-vue-components

### Views (`src/views/`)

- Page-level components organized by route structure
- Each view represents a distinct page or route
- May contain sub-folders for complex page hierarchies

### Stores (`src/stores/`)

- Pinia stores for state management
- Organized by domain/feature area
- Include authentication, user data, and application state

## Asset Management

### Static Assets (`public/`)

- `logo.svg` - Application logo
- `manifest.json` - PWA manifest
- `robots.txt` - SEO robots file
- `sitemap.xml` - SEO sitemap
- `.well-known/` - Domain verification files

### Source Assets (`src/assets/`)

- SCSS/CSS files for styling
- Images and icons used in components
- Font files and typography assets

## Build Output (`dist/`)

- Generated during `pnpm build`
- Contains optimized static files for production
- Served by web server (Nginx) in production

## Development Workflow

1. Frontend development: `pnpm dev` (port 3000)
2. Backend development: `cd serves && pnpm dev` (port 7204)
3. API proxy configured in Vite for `/api` routes
4. Auto-imports enabled for Vue, components, and utilities
5. Hot module replacement for rapid development
