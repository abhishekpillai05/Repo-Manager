# PT Repo Manager

Monorepo scaffold for the practical-test GitHub repository lifecycle manager described in `RepoManager-PRDv1.md`.

## Layout

- `apps/backend` - NestJS API
- `apps/frontend` - React + Vite UI
- `packages/shared-types` - shared DTOs and interfaces
- `packages/tsconfig` - shared TypeScript presets

## Getting Started / How to Run

This is a monorepo managed with `pnpm` and `turbo`. Follow these steps to get both the frontend and backend running locally:

### 1. Install Dependencies
From the root of the project, run:
```bash
pnpm install
```

### 2. Environment Variables
You need to set up environment variables for both applications.
- For the backend: Copy `apps/backend/.env.example` to `apps/backend/.env` and fill in your database credentials and GitHub OAuth settings.
- For the frontend: Copy `apps/frontend/.env.example` to `apps/frontend/.env` (if applicable).

### 3. Run the Database (Optional but recommended)
If you need to spin up a local PostgreSQL database using Docker, you can run:
```bash
pnpm docker:db
```

### 4. Start Development Servers
You can run both the frontend and backend simultaneously using turbo:
```bash
pnpm dev
```
Alternatively, you can run them individually from the root directory:
- **Frontend only:** `pnpm dev:frontend` (Runs on http://localhost:5173)
- **Backend only:** `pnpm dev:backend` (Runs on http://localhost:3000)



pt-repo-manager/
├── apps/
│   ├── backend/                         # NestJS Backend Application
│   │   ├── src/
│   │   │   ├── common/                  # Shared Interceptors, Guards, Filters
│   │   │   │   ├── decorators/          # @CurrentUser()
│   │   │   │   ├── guards/              # AuthGuard, RolesGuard
│   │   │   │   ├── interceptors/       # AuditLogInterceptor.ts
│   │   │   │   └── filters/             # HttpExceptionFilter.ts
│   │   │   ├── database/                # TypeORM Config & Migrations
│   │   │   │   ├── entities/            # SystemConfig, RepoOverride, AuditLog entities
│   │   │   │   ├── migrations/          # SQL Migration scripts
│   │   │   │   └── data-source.ts       # TypeORM DataSource configuration
│   │   │   ├── modules/
│   │   │   │   ├── auth/                # GitHub OAuth Passport strategy
│   │   │   │   ├── github/              # Octokit wrapper service
│   │   │   │   ├── repos/               # Repo listing, search, & candidate parsing
│   │   │   │   ├── config/              # Retention & system policy management
│   │   │   │   ├── scheduler/           # NestJS @Cron() automated daily tasks
│   │   │   │   └── audit/               # Audit logging & json2csv export engine
│   │   │   ├── app.module.ts
│   │   │   └── main.ts                  # NestJS entrypoint with ValidationPipe
│   │   ├── test/                        # Jest Integration Tests
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/                        # ReactJS + TypeScript + Vite
│       ├── src/
│       │   ├── assets/
│       │   ├── components/              # shadcn/ui and custom components
│       │   │   ├── ui/                  # shadcn buttons, dialogs, badges, tables
│       │   │   ├── dashboard/           # RepoTable, StatusBadge, CountdownBadge
│       │   │   ├── modals/              # ConfirmDeleteModal, RevokeAccessModal
│       │   │   └── layout/              # Navbar, Sidebar, AppLayout
│       │   ├── hooks/                   # React custom hooks & state logic
│       │   ├── pages/                   # Main Page Views
│       │   │   ├── Dashboard.tsx        # Candidate repos list & actions
│       │   │   ├── Settings.tsx         # Config retention rules
│       │   │   ├── AuditLog.tsx         # View audit history & export CSV
│       │   │   └── Login.tsx            # OAuth landing page
│       │   ├── services/                # Axios API Client configuration
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── e2e/                         # Playwright E2E Test Suite
│       │   └── dashboard.spec.ts
│       ├── .env.example
│       ├── index.html
│       ├── package.json
│       ├── tailwind.config.js
│       └── vite.config.ts
│
├── packages/                            # Monorepo Shared Packages
│   ├── shared-types/                    # Common DTOs & TS Interfaces
│   │   ├── src/
│   │   │   ├── repo.interface.ts
│   │   │   ├── config.interface.ts
│   │   │   └── audit.interface.ts
│   │   ├── package.json
│   │   └── index.ts
│   └── tsconfig/                        # Shared TypeScript Configurations
│       ├── base.json
│       ├── nestjs.json
│       └── react.json
│
├── pnpm-workspace.yaml                  # PNPM Workspace Configuration
├── turbo.json                           # Task orchestration
├── README.md
└── package.json