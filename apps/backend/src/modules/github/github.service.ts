import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Octokit } from 'octokit';
import { AppConfigService } from '../../config/app-config.service';
import { SystemConfigEntity } from '../../database/entities/system-config.entity';
import { GithubApiError } from './errors/github-api.error';

export interface ParsedRepoName {
  role: string;
  candidateName: string;
}

/**
 * Deterministic helper function to parse candidate test repo names following the
 * convention: pt-<role>-<candidatename>
 *
 * Rules:
 * 1. Repo name must start with prefix (e.g. 'pt-' or 'pt').
 * 2. After removing prefix, remainder is split by hyphen '-'.
 * 3. Last two hyphen-delimited segments form the candidate first and last name.
 * 4. Remaining middle segments form the role.
 * 5. Requires at least 3 parts total after prefix (1 for role, 2 for candidate name).
 * 6. Returns null if repo name does not match pattern.
 */
export function parseRepoName(repoName: string, prefix: string = 'pt-'): ParsedRepoName | null {
  if (!repoName || !prefix) return null;

  const normalizedPrefix = prefix.endsWith('-') ? prefix : `${prefix}-`;
  if (!repoName.startsWith(normalizedPrefix)) {
    return null;
  }

  const remainder = repoName.slice(normalizedPrefix.length);
  const parts = remainder.split('-').filter((p) => p.length > 0);

  // Must have at least 3 segments (e.g. ['react', 'aditya', 'mhatre'])
  if (parts.length < 3) {
    return null;
  }

  const candidateName = parts.slice(-2).join('-');
  const role = parts.slice(0, -2).join('-');

  if (!role || !candidateName) {
    return null;
  }

  return { role, candidateName };
}

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(
    private readonly appConfigService: AppConfigService,
    @InjectRepository(SystemConfigEntity)
    private readonly systemConfigRepository: Repository<SystemConfigEntity>,
  ) {}

  /**
   * Instantiates an Octokit client.
   *
   * @param userToken  - The user's OAuth access token.
   * @param preferPat  - When true (mutations: archive/delete/revoke), prefer the
   *                     server-side GITHUB_PAT which has org-admin rights over the
   *                     user's OAuth token. Defaults to false (reads prefer user token).
   */
  public createOctokitClient(userToken?: string, preferPat = false): Octokit {
    let token: string | undefined;
    if (preferPat) {
      // For mutations: PAT first (org-admin), user token as fallback
      token = this.appConfigService.githubPat || userToken;
    } else {
      // For reads: user token first, PAT as fallback
      token = userToken || this.appConfigService.githubPat;
    }
    return new Octokit({
      auth: token || undefined,
    });
  }

  /**
   * Cross-cutting resilient execution wrapper for Octokit requests.
   * Handles:
   * - Proactive primary rate-limit delay checks
   * - Exponential backoff retry on secondary rate limit / 403 responses
   * - Wrapping raw Octokit errors into typed GithubApiError
   */
  public async executeWithResilience<T>(
    fn: (octokit: Octokit) => Promise<T>,
    userToken?: string,
    maxRetries: number = 3,
    preferPat: boolean = false,
  ): Promise<T> {
    const octokit = this.createOctokitClient(userToken, preferPat);
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        return await fn(octokit);
      } catch (error: any) {
        attempt++;
        const status = error.status || error.statusCode || 500;
        const headers = error.response?.headers || {};
        const responseMessage = error.message || 'GitHub API Request Failed';

        // True rate-limit signals:
        //   - HTTP 429 (Too Many Requests)
        //   - HTTP 403 ONLY when accompanied by rate-limit headers or message keywords
        //   - Never treat permission/auth 403s as rate limits
        const hasRateLimitHeader =
          !!headers['x-ratelimit-remaining'] && headers['x-ratelimit-remaining'] === '0';
        const hasRateLimitMessage =
          responseMessage.toLowerCase().includes('rate limit') ||
          responseMessage.toLowerCase().includes('secondary rate') ||
          responseMessage.toLowerCase().includes('abuse detection');

        const isRateLimit =
          status === 429 ||
          (status === 403 && (hasRateLimitHeader || hasRateLimitMessage));

        // Non-retryable errors: permission denied, not found, bad request, etc.
        const isNonRetryable = status === 401 || status === 404 || status === 422 ||
          (status === 403 && !isRateLimit);

        if (isRateLimit && attempt < maxRetries) {
          let retryAfterMs = 1000 * Math.pow(2, attempt);

          // Respect retry-after header if provided
          if (headers['retry-after']) {
            const retryAfterSec = parseInt(headers['retry-after'], 10);
            if (!isNaN(retryAfterSec)) {
              retryAfterMs = retryAfterSec * 1000;
            }
          } else if (headers['x-ratelimit-reset']) {
            const resetTimeMs = parseInt(headers['x-ratelimit-reset'], 10) * 1000;
            const now = Date.now();
            if (resetTimeMs > now) {
              retryAfterMs = Math.min(resetTimeMs - now + 500, 60000); // cap at 60s
            }
          }

          this.logger.warn(
            `GitHub Rate limit encountered (status ${status}). Retrying attempt ${attempt}/${maxRetries} after ${retryAfterMs}ms...`,
          );
          await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
          continue;
        }

        // Fail immediately for permission errors and other non-retryable failures
        throw new GithubApiError(
          `GitHub API Error (${status}): ${responseMessage}`,
          status,
          isRateLimit,
        );
      }
    }

    throw new GithubApiError('GitHub API request failed after max retries', 500, true);
  }

  /**
   * Fetches all repositories in GITHUB_ORG_NAME using full pagination.
   */
  public async listOrgRepos(userToken?: string): Promise<any[]> {
    const org = this.appConfigService.githubOrgName;
    return this.executeWithResilience(async (octokit) => {
      return octokit.paginate(octokit.rest.repos.listForOrg, {
        org,
        per_page: 100,
        type: 'all',
      });
    }, userToken);
  }

  /**
   * Retrieves all candidate practical test repositories matching system prefix.
   * Reads prefix from SystemConfig entity in database (defaults to 'pt-').
   */
  public async getPtRepositories(userToken?: string, prefixOverride?: string): Promise<any[]> {
    let prefix = prefixOverride;
    if (!prefix) {
      // SystemConfigEntity does not carry repoPrefix; default to 'pt-'.
      // The prefix can be extended to SystemConfigEntity in a future migration.
      prefix = 'pt-';
    }

    const allRepos = await this.listOrgRepos(userToken);
    return allRepos
      .map((repo) => {
        const parsed = parseRepoName(repo.name, prefix);
        if (!parsed) return null;
        return {
          ...repo,
          parsedCandidateRole: parsed.role,
          parsedCandidateName: parsed.candidateName,
        };
      })
      .filter((repo): repo is NonNullable<typeof repo> => repo !== null);
  }

  /**
   * Public parseRepoName method delegating to deterministic utility function.
   */
  public parseRepoName(repoName: string, prefix: string = 'pt-'): ParsedRepoName | null {
    return parseRepoName(repoName, prefix);
  }

  /**
   * Fetches single repo details by repo name.
   */
  public async getRepo(repoName: string, userToken?: string): Promise<any> {
    const org = this.appConfigService.githubOrgName;
    return this.executeWithResilience(async (octokit) => {
      const response = await octokit.rest.repos.get({
        owner: org,
        repo: repoName,
      });
      return response.data;
    }, userToken);
  }

  /**
   * Lists outside collaborators for a given repository.
   */
  public async listOutsideCollaborators(repoName: string, userToken?: string): Promise<any[]> {
    const org = this.appConfigService.githubOrgName;
    return this.executeWithResilience(async (octokit) => {
      const response = await octokit.rest.repos.listCollaborators({
        owner: org,
        repo: repoName,
        affiliation: 'outside',
      });
      return response.data;
    }, userToken);
  }

  // =========================================================================
  // MUTATION STUBS
  // Below methods are skeleton stubs for downstream engineers.
  // =========================================================================

  /**
   * Skeleton: To be completed by Automation/Mutations engineer.
   * Archives a candidate repository by setting archived: true.
   */
  public async archiveRepo(repoName: string, userToken?: string): Promise<any> {
    this.logger.log(`[Skeleton] archiveRepo called for repo: ${repoName}`);
    const org = this.appConfigService.githubOrgName;
    return this.executeWithResilience(async (octokit) => {
      const response = await octokit.rest.repos.update({
        owner: org,
        repo: repoName,
        archived: true,
      });
      return response.data;
    }, userToken, 3, true); // preferPat=true: mutations need org-admin rights
  }

  /**
   * Skeleton: To be completed by Automation/Mutations engineer.
   * Permanently deletes a candidate repository.
   */
  public async deleteRepo(repoName: string, userToken?: string): Promise<void> {
    this.logger.log(`[Skeleton] deleteRepo called for repo: ${repoName}`);
    const org = this.appConfigService.githubOrgName;
    await this.executeWithResilience(async (octokit) => {
      await octokit.rest.repos.delete({
        owner: org,
        repo: repoName,
      });
    }, userToken, 3, true); // preferPat=true: mutations need org-admin rights
  }

  /**
   * Skeleton: To be completed by Access Control / Mutations engineer.
   * Revokes a collaborator's access to a repository.
   */
  public async revokeCollaborator(
    repoName: string,
    username: string,
    userToken?: string,
  ): Promise<void> {
    this.logger.log(`[Skeleton] revokeCollaborator called for repo: ${repoName}, user: ${username}`);
    const org = this.appConfigService.githubOrgName;
    await this.executeWithResilience(async (octokit) => {
      await octokit.rest.repos.removeCollaborator({
        owner: org,
        repo: repoName,
        username,
      });
    }, userToken, 3, true); // preferPat=true: mutations need org-admin rights
  }
}
