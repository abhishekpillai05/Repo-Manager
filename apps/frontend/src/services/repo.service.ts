/**
 * Repository service — placeholder methods for future backend integration.
 * Import from shared-types for type definitions.
 */
import type { RepoSummary } from '@pt-repo-manager/shared-types';
import type { RepoOverride, CreateRepoOverridePayload, UpdateRepoOverridePayload } from '@pt-repo-manager/shared-types';

export interface RepoListParams {
  page?: number;
  limit?: number;
  search?: string;
  accessStatus?: string;
  repoStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedRepoResponse {
  data: RepoSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RepoDetails extends RepoSummary {
  description: string | null;
  githubUrl: string;
  collaborators: Collaborator[];
  overrides: RepoOverride | null;
}

export interface Collaborator {
  id: string;
  username: string;
  avatarUrl: string;
  role: 'owner' | 'admin' | 'write' | 'triage' | 'read';
  addedAt: string;
}

export const repoService = {
  /**
   * Fetch paginated list of pt- repositories.
   * @throws Error Not implemented — awaiting backend.
   */
  async listRepos(_params?: RepoListParams): Promise<PaginatedRepoResponse> {
    throw new Error('Not implemented');
  },

  /**
   * Fetch a single repository's full details by ID.
   * @throws Error Not implemented — awaiting backend.
   */
  async getRepoById(_id: string): Promise<RepoDetails> {
    throw new Error('Not implemented');
  },

  /**
   * Archive a repository.
   * @throws Error Not implemented — awaiting backend.
   */
  async archiveRepo(_id: string): Promise<void> {
    throw new Error('Not implemented');
  },

  /**
   * Permanently delete a repository.
   * @throws Error Not implemented — awaiting backend.
   */
  async deleteRepo(_id: string): Promise<void> {
    throw new Error('Not implemented');
  },

  /**
   * Revoke all external collaborator access for a repository.
   * @throws Error Not implemented — awaiting backend.
   */
  async revokeAllAccess(_repoId: string): Promise<void> {
    throw new Error('Not implemented');
  },

  /**
   * Revoke a specific collaborator's access.
   * @throws Error Not implemented — awaiting backend.
   */
  async revokeCollaboratorAccess(_repoId: string, _username: string): Promise<void> {
    throw new Error('Not implemented');
  },

  /**
   * Create a lifecycle override for a specific repository.
   * @throws Error Not implemented — awaiting backend.
   */
  async createOverride(_payload: CreateRepoOverridePayload): Promise<RepoOverride> {
    throw new Error('Not implemented');
  },

  /**
   * Update a lifecycle override.
   * @throws Error Not implemented — awaiting backend.
   */
  async updateOverride(_id: string, _payload: UpdateRepoOverridePayload): Promise<RepoOverride> {
    throw new Error('Not implemented');
  },

  /**
   * Delete a lifecycle override (repo reverts to global config).
   * @throws Error Not implemented — awaiting backend.
   */
  async deleteOverride(_id: string): Promise<void> {
    throw new Error('Not implemented');
  },
};
