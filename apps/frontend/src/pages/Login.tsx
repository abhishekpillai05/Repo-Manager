import { GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { APP_NAME } from '@/lib/constants';

export function Login() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GitBranch className="h-4.5 w-4.5" />
          </div>
          <span className="text-sm font-semibold">{APP_NAME}</span>
        </div>

        <div className="space-y-6">
          <blockquote className="space-y-3">
            <p className="text-xl font-medium leading-relaxed text-sidebar-foreground">
              "A centralized, auditable way to manage the full lifecycle of candidate test
              repositories — so your team can focus on hiring, not housekeeping."
            </p>
            <footer className="text-sm text-sidebar-foreground/60">
              Engineering Platform Team
            </footer>
          </blockquote>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { label: 'Repos tracked', value: '—' },
              { label: 'Auto-deletions', value: '—' },
              { label: 'Audit entries', value: '—' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-xl font-bold text-sidebar-foreground">{stat.value}</p>
                <p className="text-xs text-sidebar-foreground/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-sidebar-foreground/30">
          Internal tool · Engineering use only
        </p>
      </div>

      {/* Right panel - login form */}
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GitBranch className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-foreground">{APP_NAME}</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Sign in to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Authenticate with your GitHub account to access the repository management dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              id="github-signin-btn"
              variant="default"
              size="lg"
              className="w-full gap-3 h-11"
              onClick={() => {
                /* authService.initiateGitHubLogin() */
              }}
            >
              {/* GitHub SVG icon */}
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12" />
              </svg>
              Continue with GitHub
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-3 text-muted-foreground">
                  Access restricted to org members
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
              <p className="text-xs font-medium text-foreground">Required GitHub permissions</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 flex-shrink-0" />
                  <code className="font-mono">repo</code> — Read, archive, and delete repositories
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 flex-shrink-0" />
                  <code className="font-mono">admin:org</code> — Manage collaborators
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 flex-shrink-0" />
                  <code className="font-mono">read:user</code> — Identify actor for audit log
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 flex-shrink-0" />
                  <code className="font-mono">delete_repo</code> — Permanent deletion
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to responsible use of this internal tool.
          </p>
        </div>
      </div>
    </div>
  );
}
