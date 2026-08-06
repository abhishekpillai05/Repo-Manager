import { Injectable } from "@nestjs/common";

import { GithubService } from "../github/github.service";
import { SystemConfigService } from "../config/system-config.service";
import { RepoOverrideService } from "../config/repo-override.service";
import { LifeCycleService } from "../lifecycle/lifecycle.service";
import { RepositoryStatus } from "../lifecycle/repository-status.enum";

import { GetRepositoriesQueryDto } from "./dto/get-repositories-query.dto";
import { RepositorySortField } from "./enums/repository-sort-field.enum";
import { SortOrder } from "./enums/sort-order.enum";
import { RepositoryDto } from "./dto/repository.dto";
import { RepositoryDetailsDto } from "./dto/repository-details.dto";
import { CollaboratorDto } from "./dto/collaborator.dto";
import { OperationResponseDto } from "./dto/operation-response.dto";
import { RepoStatus } from "./enums/repo-status.enum";
import { AccessStatus } from "./enums/access-status.enum";
import { CountdownColor } from "./enums/countdown-color.enum";

@Injectable()
export class ReposService {
  constructor(
    private readonly githubService: GithubService,
    private readonly systemConfigService: SystemConfigService,
    private readonly repoOverrideService: RepoOverrideService,
    private readonly lifecycleService: LifeCycleService,
  ) {}

  // ---------------------------------------------------------------------------
  // Private Helpers — Enum Bridging
  // ---------------------------------------------------------------------------

  /**
   * Maps LifeCycleService's RepositoryStatus to the frontend RepoStatus enum.
   *
   * RepositoryStatus (lifecycle domain) → RepoStatus (API/DTO domain)
   *   ACTIVE  → LIVE
   *   WARNING → LIVE          (still active, just approaching deletion)
   *   EXPIRED → PENDING_DELETION
   *   ARCHIVED → ARCHIVED
   */
  private mapToRepoStatus(status: RepositoryStatus): RepoStatus {
    switch (status) {
      case RepositoryStatus.ACTIVE:
      case RepositoryStatus.WARNING:
        return RepoStatus.LIVE;
      case RepositoryStatus.EXPIRED:
        return RepoStatus.PENDING_DELETION;
      case RepositoryStatus.ARCHIVED:
        return RepoStatus.ARCHIVED;
    }
  }

  /**
   * Derives the countdown badge color from days remaining
   * relative to the configured warning threshold.
   *
   *   > warningDays  → GREEN
   *   > 0 (warning)  → AMBER
   *   ≤ 0 (expired)  → RED
   */
  private mapToCountdownColor(
    daysRemaining: number,
    warningDays: number,
  ): CountdownColor {
    if (daysRemaining > warningDays) {
      return CountdownColor.GREEN;
    }
    if (daysRemaining > 0) {
      return CountdownColor.AMBER;
    }
    return CountdownColor.RED;
  }

  /**
   * Derives the access status from the outside collaborator list.
   *
   *   Has outside collaborators → ACTIVE
   *   No outside collaborators  → REVOKED
   */
  private mapToAccessStatus(collaboratorCount: number): AccessStatus {
    return collaboratorCount > 0 ? AccessStatus.ACTIVE : AccessStatus.REVOKED;
  }

  // ---------------------------------------------------------------------------
  // Private Core — Build a single RepositoryDto from a raw GitHub repo object
  // ---------------------------------------------------------------------------

  /**
   * Merges GitHub data, config, overrides, and lifecycle calculations
   * into a single RepositoryDto.
   *
   * Called by both getRepositories() and getRepository().
   */
  private async buildRepositoryDto(
    repo: any,
    config: {
      retentionDays: number;
      warningDays: number;
    },
    collaboratorCount: number,
  ): Promise<RepositoryDto> {
    const today = new Date();
    const createdAt = new Date(repo.created_at);

    // Effective retention days (override takes precedence over global config)
    const retentionDays = await this.repoOverrideService.getEffectiveRetentionDays(
      String(repo.id),
    );

    // Effective deletion date — delegate to LifeCycleService
    const effectiveDeletionDate = this.lifecycleService.getEffectiveDeletionDate(
      createdAt,
      retentionDays,
      null,
    );

    // Days remaining — delegate to LifeCycleService
    const daysUntilDeletion = this.lifecycleService.getDaysRemaining(
      effectiveDeletionDate,
      today,
    );

    // Days since creation
    const daysSinceCreation = Math.floor(
      (today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Repository status — delegate to LifeCycleService
    const repositoryStatus = this.lifecycleService.determineRepositoryStatus(
      repo.archived ?? false,
      daysUntilDeletion,
      config.warningDays,
    );

    return {
      repositoryName: repo.name,
      candidateName: repo.parsedCandidateName ?? "",
      candidateRole: repo.parsedCandidateRole ?? "",
      createdAt,
      daysSinceCreation,
      daysUntilDeletion,
      repoStatus: this.mapToRepoStatus(repositoryStatus),
      accessStatus: this.mapToAccessStatus(collaboratorCount),
      countdownColor: this.mapToCountdownColor(
        daysUntilDeletion,
        config.warningDays,
      ),
    };
  }

  // ---------------------------------------------------------------------------
  // Public API Methods
  // ---------------------------------------------------------------------------

  /**
   * Returns all PT repositories for the dashboard.
   *
   * Flow:
   * 1. Fetch repositories from GithubService (already filtered + parsed)
   * 2. Fetch global configuration from SystemConfigService
   * 3. For each repository:
   *    a. Fetch outside collaborators from GithubService
   *    b. Fetch effective retention days from RepoOverrideService
   *    c. Calculate lifecycle fields via LifeCycleService
   *    d. Map to RepositoryDto
   * 4. Apply search filter, sort, and paginate
   * 5. Return RepositoryDto[]
   */
  async getRepositories(query: GetRepositoriesQueryDto): Promise<RepositoryDto[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const search = query.search?.trim().toLowerCase();
    const repoStatusFilter = query.repoStatus;
    const accessStatusFilter = query.accessStatus;
    const sortBy = query.sortBy ?? RepositorySortField.CREATED_AT;
    const order = query.order ?? SortOrder.DESC;

    // Fetch all PT repositories from GitHub (already filtered and parsed by GithubService)
    const repositories = await this.githubService.getPtRepositories();

    // Fetch global configuration once for the entire batch
    const config = await this.systemConfigService.getOrCreateDefaultConfig();

    // Build DTOs in parallel — fetch collaborators per repo concurrently
    const dtos = await Promise.all(
      repositories.map(async (repo) => {
        const collaborators = await this.githubService.listOutsideCollaborators(
          repo.name,
        );
        return this.buildRepositoryDto(repo, config, collaborators.length);
      }),
    );

    // Apply search filter
    let filtered = search
      ? dtos.filter(
          (dto) =>
            dto.repositoryName.toLowerCase().includes(search) ||
            dto.candidateName.toLowerCase().includes(search) ||
            dto.candidateRole.toLowerCase().includes(search),
        )
      : dtos;

    // Apply repoStatus filter
    if (repoStatusFilter) {
      filtered = filtered.filter((dto) => dto.repoStatus === repoStatusFilter);
    }

    // Apply accessStatus filter
    if (accessStatusFilter) {
      filtered = filtered.filter(
        (dto) => dto.accessStatus === accessStatusFilter,
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === RepositorySortField.CREATED_AT) {
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
      } else if (sortBy === RepositorySortField.DAYS_UNTIL_DELETION) {
        comparison = a.daysUntilDeletion - b.daysUntilDeletion;
      } else if (sortBy === RepositorySortField.REPOSITORY_NAME) {
        comparison = a.repositoryName.localeCompare(b.repositoryName);
      } else if (sortBy === RepositorySortField.CANDIDATE_NAME) {
        comparison = a.candidateName.localeCompare(b.candidateName);
      }
      return order === SortOrder.ASC ? comparison : -comparison;
    });

    // Paginate
    const offset = (page - 1) * limit;
    return filtered.slice(offset, offset + limit);
  }

  /**
   * Returns detailed information for a single repository.
   *
   * Flow:
   * 1. Fetch repository from GithubService
   * 2. Fetch outside collaborators from GithubService
   * 3. Fetch global configuration from SystemConfigService
   * 4. Build RepositoryDetailsDto (extends RepositoryDto + githubUrl)
   */
  async getRepository(repositoryName: string): Promise<RepositoryDetailsDto> {
    const repo = await this.githubService.getRepo(repositoryName);
    const collaborators = await this.githubService.listOutsideCollaborators(
      repositoryName,
    );
    const config = await this.systemConfigService.getOrCreateDefaultConfig();

    const base = await this.buildRepositoryDto(repo, config, collaborators.length);

    return {
      ...base,
      githubUrl: repo.html_url ?? `https://github.com/${repositoryName}`,
    };
  }

  /**
   * Returns all outside collaborators for a repository.
   *
   * Flow:
   * 1. Fetch outside collaborators from GithubService
   * 2. Map to CollaboratorDto[]
   */
  async getCollaborators(repositoryName: string): Promise<CollaboratorDto[]> {
    const collaborators = await this.githubService.listOutsideCollaborators(
      repositoryName,
    );

    return collaborators.map((collaborator) => ({
      username: collaborator.login,
      avatarUrl: collaborator.avatar_url,
      role: this.resolveCollaboratorRole(collaborator.permissions),
      type: collaborator.type,
    }));
  }

  /**
   * Archives a repository.
   *
   * Flow:
   * 1. Archive via GithubService
   * 2. Return success response
   */
  async archiveRepository(repositoryName: string): Promise<OperationResponseDto> {
    await this.githubService.archiveRepo(repositoryName);
    return {
      success: true,
      message: "Repository archived successfully.",
    };
  }

  /**
   * Deletes a repository.
   *
   * Flow:
   * 1. Delete via GithubService
   * 2. Return success response
   */
  async deleteRepository(repositoryName: string): Promise<OperationResponseDto> {
    await this.githubService.deleteRepo(repositoryName);
    return {
      success: true,
      message: "Repository deleted successfully.",
    };
  }

  /**
   * Removes a single collaborator from a repository.
   *
   * Flow:
   * 1. Revoke collaborator via GithubService
   * 2. Return success response
   */
  async removeCollaborator(
    repositoryName: string,
    username: string,
  ): Promise<OperationResponseDto> {
    await this.githubService.revokeCollaborator(repositoryName, username);
    return {
      success: true,
      message: "Collaborator removed successfully.",
    };
  }

  /**
   * Removes all outside collaborators from a repository.
   *
   * Flow:
   * 1. Fetch outside collaborators from GithubService
   * 2. Revoke each one sequentially via GithubService
   * 3. Return success response
   *
   * Note: No new GithubService method required — loops revokeCollaborator().
   */
  async removeAllCollaborators(
    repositoryName: string,
  ): Promise<OperationResponseDto> {
    const collaborators = await this.githubService.listOutsideCollaborators(
      repositoryName,
    );

    for (const collaborator of collaborators) {
      await this.githubService.revokeCollaborator(
        repositoryName,
        collaborator.login,
      );
    }

    return {
      success: true,
      message: "All collaborators removed successfully.",
    };
  }

  // ---------------------------------------------------------------------------
  // Private Helper — Collaborator Role Mapping
  // ---------------------------------------------------------------------------

  /**
   * Maps GitHub permissions object to a human-readable role string.
   */
  private resolveCollaboratorRole(permissions: any): string {
    if (!permissions) return "read";
    if (permissions.admin) return "admin";
    if (permissions.maintain) return "maintain";
    if (permissions.push) return "write";
    if (permissions.triage) return "triage";
    return "read";
  }
}
