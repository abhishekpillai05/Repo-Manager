/**
 * Repository service — placeholder methods for future backend integration.
 * Import from shared-types for type definitions.
 */
import type { RepoSummary } from '@pt-repo-manager/shared-types';
import type { RepoOverride, CreateRepoOverridePayload, UpdateRepoOverridePayload } from '@pt-repo-manager/shared-types';
import { apiGet, apiPost, apiPut, apiDelete } from './api';

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
  async listRepos(params?: RepoListParams | any): Promise<PaginatedRepoResponse> {
    // Map frontend filter naming to backend DTO naming
    const queryParams: Record<string, string> = {
      page: String(params?.page || 1),
      limit: String(params?.limit || 20),
    };
    if (params?.query) queryParams.search = params.query;
    if (params?.search) queryParams.search = params.search;
    // Pass filter values directly — backend enums now match frontend values (Title Case)
    if (params?.accessStatus) queryParams.accessStatus = params.accessStatus;
    if (params?.repoStatus) queryParams.repoStatus = params.repoStatus;
    if (params?.sortBy) {
      queryParams.sortBy = params.sortBy === 'name' ? 'repositoryName' : params.sortBy;
    }
    if (params?.sortOrder) queryParams.order = params.sortOrder;

    // Note: Backend currently returns an array of RepositoryDto, mapping it to RepoSummary for frontend
    const rawData = await apiGet<any[]>('/repos', queryParams);
    const data: RepoSummary[] = rawData.map(item => ({
      id: item.repositoryName,
      name: item.repositoryName,
      candidateName: item.candidateName,
      role: item.candidateRole,
      createdAt: item.createdAt,
      daysSinceCreation: item.daysSinceCreation,
      daysUntilDeletion: item.daysUntilDeletion,
      accessStatus: item.accessStatus,
      repoStatus: item.repoStatus,
    }));
    return {
      data,
      total: data.length,
      page: params?.page || 1,
      limit: params?.limit || data.length,
      totalPages: 1,
    };
  },

  /**
   * Fetch a single repository's full details by ID.
   * @throws Error Not implemented — awaiting backend.
   */
  async getRepoById(id: string): Promise<RepoDetails> {
    const [rawDetails, rawCollaborators] = await Promise.all([
      apiGet<any>(`/repos/${id}`),
      apiGet<any[]>(`/repos/${id}/collaborators`).catch(() => []),
    ]);

    return {
      id: rawDetails.repositoryName,
      name: rawDetails.repositoryName,
      candidateName: rawDetails.candidateName,
      role: rawDetails.candidateRole,
      createdAt: rawDetails.createdAt,
      daysSinceCreation: rawDetails.daysSinceCreation,
      daysUntilDeletion: rawDetails.daysUntilDeletion,
      accessStatus: rawDetails.accessStatus,
      repoStatus: rawDetails.repoStatus,
      description: null,
      githubUrl: rawDetails.githubUrl,
      collaborators: rawCollaborators.map(c => ({
        id: c.username,
        username: c.username,
        avatarUrl: c.avatarUrl,
        role: c.role as any,
        addedAt: rawDetails.createdAt, // fallback since backend doesn't provide
      })),
      overrides: null,
    };
  },

  /**
   * Archive a repository.
   * @throws Error Not implemented — awaiting backend.
   */
  async archiveRepo(id: string): Promise<void> {
    await apiPost(`/repos/${id}/archive`);
  },

  /**
   * Permanently delete a repository.
   * @throws Error Not implemented — awaiting backend.
   */
  async deleteRepo(id: string): Promise<void> {
    await apiDelete(`/repos/${id}`);
  },

  /**
   * Revoke all external collaborator access for a repository.
   * @throws Error Not implemented — awaiting backend.
   */
  async revokeAllAccess(repoId: string): Promise<void> {
    await apiDelete(`/repos/${repoId}/collaborators`);
  },

  /**
   * Revoke a specific collaborator's access.
   * @throws Error Not implemented — awaiting backend.
   */
  async revokeCollaboratorAccess(repoId: string, username: string): Promise<void> {
    await apiDelete(`/repos/${repoId}/collaborators/${username}`);
  },

  /**
   * Create a lifecycle override for a specific repository.
   */
  async createOverride(payload: CreateRepoOverridePayload): Promise<RepoOverride> {
    return apiPost<RepoOverride>('/config/overrides', payload);
  },

  /**
   * Update a lifecycle override.
   */
  async updateOverride(repositoryId: string, payload: UpdateRepoOverridePayload): Promise<RepoOverride> {
    return apiPut<RepoOverride>(`/config/overrides/${repositoryId}`, payload);
  },

  /**
   * Delete a lifecycle override (repo reverts to global config).
   */
  async deleteOverride(repositoryId: string): Promise<void> {
    await apiDelete(`/config/overrides/${repositoryId}`);
  },
};
