/** Application-wide constants */

export const APP_NAME = 'PT Repo Manager';
export const APP_VERSION = '1.0.0';

/** GitHub OAuth callback path */
export const GITHUB_AUTH_CALLBACK = '/auth/github/callback';

/** Default pagination page size */
export const DEFAULT_PAGE_SIZE = 20;

/** Available page size options */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

/** Countdown thresholds in days */
export const COUNTDOWN_DANGER_DAYS = 10;
export const COUNTDOWN_WARNING_DAYS = 30;

/** Sidebar navigation items */
export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Repositories',
    href: '/repositories',
    icon: 'GitFork',
  },
  {
    label: 'Audit Log',
    href: '/audit-log',
    icon: 'ScrollText',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: 'Settings',
  },
] as const;

/** Access status options for filter */
export const ACCESS_STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'Active' },
  { label: 'Revoked', value: 'Revoked' },
] as const;

/** Repo status options for filter */
export const REPO_STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Live', value: 'Live' },
  { label: 'Archived', value: 'Archived' },
  { label: 'Pending Deletion', value: 'Pending Deletion' },
] as const;

/** Audit action labels */
export const AUDIT_ACTION_LABELS: Record<string, string> = {
  CONFIG_UPDATED: 'Config Updated',
  OVERRIDE_CREATED: 'Override Created',
  OVERRIDE_UPDATED: 'Override Updated',
  OVERRIDE_DELETED: 'Override Deleted',
  REPOSITORY_DELETED: 'Repository Deleted',
  REPOSITORY_ARCHIVED: 'Repository Archived',
  COLLABORATOR_REVOKED: 'Collaborator Revoked',
};
