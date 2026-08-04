# PT Repo Manager

Monorepo scaffold for the practical-test GitHub repository lifecycle manager described in `RepoManager-PRDv1.md`.

## Layout

- `apps/backend` - NestJS API
- `apps/frontend` - React + Vite UI
- `packages/shared-types` - shared DTOs and interfaces
- `packages/tsconfig` - shared TypeScript presets

## Next steps

1. Install dependencies with `pnpm install`.
2. Wire the backend to GitHub OAuth, TypeORM, and the scheduler flows.
3. Connect the frontend to the API and fill in dashboard interactions.





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
