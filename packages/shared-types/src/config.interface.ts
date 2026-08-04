export interface LifecycleConfig {
  repoPrefix: string;
  retentionDays: number;
  defaultExpiryAction: 'Delete' | 'Archive';
  preDeletionWarningDays: number;
  githubOrgName: string;
}
