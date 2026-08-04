export interface RepoOverride {
  id: string;
  repositoryId: string;
  repositoryName: string;
  /** null means the repository inherits the global SystemConfig.retentionDays */
  retentionDays: number | null;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRepoOverridePayload {
  repositoryId: string;
  repositoryName: string;
  retentionDays?: number | null;
  reason?: string | null;
}

export interface UpdateRepoOverridePayload {
  repositoryName?: string;
  retentionDays?: number | null;
  reason?: string | null;
}
