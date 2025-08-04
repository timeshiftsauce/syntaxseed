# Project Structure & Organization

## Root Directory Layout

```
/
├── client/              # Vue 3 frontend application
├── server/              # Express.js backend API
├── dashboard/           # BuildAdmin PHP admin panel
├── .kiro/               # Kiro AI assistant configuration
├── .vercel/             # Vercel deployment configuration
├── docker-compose.yml   # Docker orchestration
├── package.json         # Root workspace configuration
└── README.md            # Project documentation
```

## Client Structure (Frontend)

```
client/
├── src/
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── components/      # Reusable Vue components
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia state management
│   ├── utils/           # Utility functions and helpers
│   ├── views/           # Page components/views
│   ├── App.vue          # Root Vue component
│   └── main.ts          # Application entry point
├── public/              # Static public assets
├── dist/                # Build output directory
├── .env.development     # Development environment variables
├── .env.production      # Production environment variables
├── vite.config.ts       # Vite build configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Frontend dependencies
```

## Server Structure (Backend)

```
server/
├── auth/                # Authentication middleware and utilities
├── config/              # Configuration files
├── getData/             # API route handlers and controllers
├── middleware/          # Express middleware functions
├── services/            # Business logic services
├── logs/                # Application log files
├── db.js                # Database connection setup
├── db.config.yaml       # Database configuration
├── index.js             # Main server entry point
├── start.js             # Production startup script
├── cluster.js           # Cluster mode configuration
└── package.json         # Backend dependencies
```

## Dashboard Structure (Admin Panel)

```
dashboard/
├── app/                 # ThinkPHP application code
├── config/              # Framework configuration
├── database/            # Database migrations and seeds
├── modules/             # Custom modules
├── public/              # Web-accessible files
├── runtime/             # Runtime cache and logs
├── static/              # Static assets
├── vendor/              # Composer dependencies
├── web/                 # Frontend build output
└── composer.json        # PHP dependencies
```

## Key Configuration Files

### Environment Files

- `client/.env.development` - Frontend development config
- `client/.env.production` - Frontend production config
- `server/db.config.yaml` - Database connection settings
- `dashboard/.env` - Admin panel configuration

### Build & Development

- `vite.config.ts` - Frontend build configuration
- `tailwind.config.js` - CSS framework configuration
- `docker-compose.yml` - Container orchestration
- `ecosystem.config.js` - PM2 process management

## Naming Conventions

### Files & Directories

- Use kebab-case for component files: `blog-post.vue`
- Use PascalCase for Vue components: `BlogPost.vue`
- Use camelCase for JavaScript/TypeScript files: `apiClient.ts`
- Use lowercase for directories: `components/`, `utils/`

### Code Style

- Vue components use Composition API with `<script setup>`
- TypeScript interfaces use PascalCase: `BlogPost`, `UserProfile`
- API endpoints use REST conventions: `/api/posts`, `/api/users`
- Database tables use snake_case: `blog_posts`, `user_profiles`

## Import Patterns

- Use absolute imports from `src/` in frontend
- Prefer named exports over default exports
- Group imports: external libraries, internal modules, relative imports
- Use auto-imports for Vue composition functions and components

## Asset Organization

- Images in `client/src/assets/images/`
- Icons handled by unplugin-icons
- Fonts loaded via unplugin-fonts
- Static files in `client/public/` for direct access
