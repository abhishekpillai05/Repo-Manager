# PT Repo Manager

> **GitHub Practical Test Repository Lifecycle Management**

PT Repo Manager is an internal web application designed to help engineering and tech leads manage the complete lifecycle of GitHub repositories created for candidate practical tests.

It provides a centralized dashboard for identifying `pt-*` repositories, monitoring their lifecycle, managing collaborator access, archiving or deleting repositories, configuring retention policies, and maintaining an auditable history of administrative actions.

The project is implemented as a **TypeScript monorepo** with a NestJS backend, React frontend, and shared TypeScript packages.

---

## 🎯 Problem

Organizations often create one GitHub repository per candidate during technical or practical assessments.

For example:

```text
pt-backend-john-doe
pt-frontend-jane-doe
pt-fullstack-alex-smith
```

As the number of candidates grows, manually managing these repositories becomes difficult.

Common problems include:

* Candidate access remaining active after the assessment
* Old repositories accumulating in the organization
* No centralized view of repository status
* Inconsistent deletion and retention policies
* Difficulty tracking who performed administrative actions
* Manual effort required to archive or remove expired repositories

**PT Repo Manager solves this by providing one centralized system for repository lifecycle management.**

---

## ✨ Features

### 📊 Repository Dashboard

Centralized dashboard for managing practical-test repositories.

* Lists repositories matching the configured `pt-` prefix
* Displays candidate and role information
* Shows repository creation date
* Tracks repository age
* Displays remaining retention time
* Shows access status
* Shows repository lifecycle status
* Search and filtering support
* Sorting by creation date and remaining time
* Pagination for large repository lists
* Visual countdown indicators

Example:

```text
Repository              Candidate       Role          Status
----------------------------------------------------------------
pt-backend-john         John Doe        Backend       Live
pt-frontend-sarah       Sarah Smith     Frontend      Archived
pt-fullstack-alex       Alex Brown      Full Stack    Pending
```

---

### 🔐 Access Management

Manage candidate access directly from the application.

* View repository collaborators
* View outside collaborators
* Revoke access for individual users
* Revoke external collaborators in bulk
* Confirmation before destructive access changes
* Changes are synchronized through the GitHub API

This helps ensure that candidate access does not remain active unnecessarily after an assessment.

---

### ♻️ Repository Lifecycle Management

The application supports multiple repository lifecycle actions.

#### Archive

Repositories can be archived instead of permanently deleted.

Archiving preserves the repository while preventing normal write activity.

#### Delete

Repositories can be permanently deleted through the GitHub API.

For safety, manual deletion requires confirmation and repository-name verification.

All lifecycle actions are recorded in the audit history.

---

### ⏰ Automated Repository Expiration

Repository retention can be configured according to organizational requirements.

Default policy:

```text
Retention Period:       90 days
Default Expiry Action:  Delete
Pre-deletion Warning:   7 days
```

The system calculates the expiration date using:

```text
Repository Creation Date + Retention Period
```

A scheduled background process can identify repositories that have exceeded their configured retention period and perform the configured lifecycle action.

Repositories can also have their expiration date overridden when additional time is required.

---

### ⚙️ Configurable Policies

Lifecycle policies can be configured without changing application code.

| Setting              | Default                 |
| -------------------- | ----------------------- |
| Repository Prefix    | `pt-`                   |
| Retention Period     | `90 days`               |
| Expiry Action        | Delete                  |
| Pre-deletion Warning | `7 days`                |
| GitHub Organization  | Configured during setup |

This allows organizations to adapt the tool to different practical-test policies.

---

### 📝 Audit Logging

Administrative actions are recorded in an append-only audit history.

The audit system is designed to capture events such as:

* User login
* Access revocation
* Repository archive
* Manual repository deletion
* Automatic repository deletion
* Configuration changes

Each event can contain:

```text
Actor
Action
Repository
Timestamp
IP Address
```

The audit interface supports filtering and CSV export for compliance and review purposes.

---

## 🏗️ Architecture

The project follows a monorepo architecture:

```text
PT Repo Manager
│
├── apps/
│   ├── backend/
│   │   └── NestJS API
│   │
│   └── frontend/
│       └── React + Vite
│
├── packages/
│   ├── shared-types/
│   │   └── Shared DTOs & interfaces
│   │
│   └── tsconfig/
│       └── Shared TypeScript configurations
│
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── RepoManager-PRDv1.md
```

The repository currently defines `apps/backend`, `apps/frontend`, and shared packages as the intended project structure.

---

## 🛠️ Tech Stack

### Backend

* **NestJS**
* **TypeScript**
* **TypeORM**
* **PostgreSQL**
* **GitHub API / Octokit**
* **Passport / GitHub OAuth**
* **Jest**

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **shadcn/ui**
* **Axios**
* **Playwright**

### Infrastructure & Tooling

* **pnpm**
* **Turborepo**
* **GitHub API**
* **GitHub OAuth**

The repository is configured as a pnpm workspace and uses Turborepo for development, builds, linting, and testing.

---

## 🔄 Application Workflow

```text
                ┌─────────────────────┐
                │    GitHub Org       │
                │                     │
                │   pt-* repositories │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │    Backend API      │
                │      NestJS         │
                └──────────┬──────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        GitHub API     PostgreSQL    Scheduler
              │            │            │
              └────────────┼────────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   React Dashboard   │
                │                     │
                │  • Repositories     │
                │  • Access Control   │
                │  • Configuration    │
                │  • Audit Logs       │
                └─────────────────────┘
```

---

## 🔑 Authentication & GitHub Integration

The application is designed to integrate with GitHub using OAuth authentication.

GitHub API access is required for operations such as:

* Reading repositories
* Listing collaborators
* Managing repository access
* Archiving repositories
* Deleting repositories
* Identifying the authenticated user

The PRD specifies GitHub OAuth and the required repository/organization permissions for these operations.

> **Security Note:** GitHub credentials, OAuth secrets, access tokens, and other sensitive configuration values should never be committed to the repository.

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* pnpm
* PostgreSQL
* Git
* GitHub OAuth application credentials

---

### 1. Clone the repository

```bash
git clone https://github.com/abhishekpillai05/Repo-Manager.git

cd Repo-Manager
```

---

### 2. Install dependencies

```bash
pnpm install
```

The project uses **pnpm 9** as its package manager.

---

### 3. Configure environment variables

Create the required environment files from the provided examples:

```text
apps/backend/.env
apps/frontend/.env
```

Typical configuration includes:

```env
DATABASE_URL=your_postgresql_connection_string

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

GITHUB_ORG=your_github_organization
```

> Never commit `.env` files or GitHub credentials.

---

### 4. Start the development environment

```bash
pnpm dev
```

The root project is configured to run development tasks across the workspace using Turborepo.

---

## 📦 Available Commands

### Development

```bash
pnpm dev
```

Starts development applications in parallel.

### Build

```bash
pnpm build
```

Builds the project packages and applications.

### Lint

```bash
pnpm lint
```

Runs linting across the workspace.

### Test

```bash
pnpm test
```

Runs the configured test suites.

These commands are defined in the root `package.json`.

---

## 🧪 Testing Strategy

The project is intended to use multiple levels of testing:

```text
Unit Tests
    │
    ▼
Backend Integration Tests
    │
    ▼
API Testing
    │
    ▼
Frontend Tests
    │
    ▼
Playwright E2E Tests
```

Important areas to test include:

* Repository filtering
* Candidate/role parsing
* Retention-date calculations
* Access revocation
* Archive operations
* Delete confirmation
* Scheduler behavior
* Configuration changes
* Audit logging
* GitHub API failures
* Authentication and authorization

---

## 🗄️ Data & Persistence

PostgreSQL is used for application-side persistence.

The database is intended to maintain information such as:

* System configuration
* Repository-specific overrides
* Audit events
* Lifecycle metadata

TypeORM is used as the backend database access layer.

---

## 🔒 Security Considerations

Repository lifecycle management involves destructive operations, so security is a major consideration.

The application should:

* Authenticate users through GitHub OAuth
* Protect administrative operations
* Require confirmation for destructive actions
* Never expose GitHub credentials to the frontend
* Keep secrets in environment variables
* Maintain an audit trail of administrative actions
* Restrict access to authorized organization users
* Avoid storing sensitive credentials in source control

Deletion operations should be treated as irreversible.

---

## 📋 Project Scope

### In Scope

* GitHub repository management
* `pt-*` repository discovery
* Repository dashboard
* Candidate access management
* Repository archiving
* Repository deletion
* Automated retention policies
* Lifecycle configuration
* Audit logging
* CSV audit export
  

## 🗺️ Roadmap

### Phase 1 — Foundation

* [x] Monorepo setup
* [x] Backend application structure
* [x] Frontend application structure
* [x] Shared TypeScript packages

### Phase 2 — GitHub Integration

* [ ] GitHub OAuth
* [ ] GitHub API integration
* [ ] Organization repository discovery
* [ ] Collaborator management

### Phase 3 — Repository Dashboard

* [ ] Repository listing
* [ ] Candidate/role parsing
* [ ] Search and filtering
* [ ] Repository status
* [ ] Lifecycle countdown

### Phase 4 — Lifecycle Management

* [ ] Archive repository
* [ ] Manual deletion
* [ ] Repository-specific expiry overrides
* [ ] Automated retention scheduler

### Phase 5 — Administration

* [ ] Configuration panel
* [ ] Audit log
* [ ] Audit filtering
* [ ] CSV export
* [ ] In-app expiry notifications

### Phase 6 — Quality & Deployment

* [ ] Unit tests
* [ ] Integration tests
* [ ] E2E tests
* [ ] Production configuration
* [ ] Deployment

---

## 🎯 Why This Project?

PT Repo Manager demonstrates practical experience with:

* Full-stack application architecture
* NestJS backend development
* React frontend development
* TypeScript monorepo design
* REST API development
* GitHub API integration
* OAuth authentication
* PostgreSQL persistence
* Background job scheduling
* Role-based access control
* Audit logging
* Automated repository lifecycle management
* End-to-end testing

Rather than simply displaying GitHub repositories, the project focuses on solving an operational problem: **reducing the manual effort and security risks involved in managing temporary repositories created for technical assessments.**

---

## 📄 Project Documentation

The repository includes the project's Product Requirements Document:

**`RepoManager-PRDv1.md`**

It defines the product goals, user personas, functional requirements, lifecycle policies, GitHub permissions, and user stories.

---


If this repository is intended to be publicly distributed, add an appropriate `LICENSE` file before assigning an open-source license in this README.
