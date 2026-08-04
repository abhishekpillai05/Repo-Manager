import { Injectable } from "@nestjs/common";
import { GetRepositoriesQueryDto } from "./dto/get-repositories-query.dto";
import { RepositorySortField } from "./enums/epository-sort-field.enum";
import { SortOrder } from "./enums/sort-order.enum";

@Injectable()
export class ReposService {
  /**
   * Returns all PT repositories for the dashboard.
   *
   * Flow:
   * 1. Fetch repositories from GitHub (GithubService)
   * 2. Filter repositories using configured prefix
   * 3. Parse repository name into role & candidate
   * 4. Merge deletion overrides
   * 5. Calculate countdown & status
   * 6. Return RepositoryDto[]
   *
   * Dependencies:
   * - GithubService (Engineer A)
   * - ConfigService (Engineer B)
   * - OverrideService (Engineer B)
   *
   * NOTE:
   * Currently returns mock data until dependent services are available.
   */
  getRepositories(query: GetRepositoriesQueryDto) {
    // TODO(Engineer A):
    // Replace mock data with:
    // const repos = await githubService.listRepos();

    // TODO(Engineer B):
    // Fetch system configuration.
    // const config = await configService.getConfig();

    // TODO(Engineer B):
    // Fetch deletion overrides.
    // const overrides = await overrideService.getOverrides();

    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const search = query.search?.trim();
    const repoStatus = query.repoStatus;
    const accessStatus = query.accessStatus;

    const sortBy = query.sortBy ?? RepositorySortField.CREATED_AT;

    const order = query.order ?? SortOrder.DESC;

    // =====================================
    // Integration Point (Engineer A)
    // =====================================
    //
    // Expected:
    //
    // const repositories =
    // await githubService.listRepositories();
    //
    // =====================================

    return {
      page,

      limit,

      search,

      repoStatus,

      accessStatus,

      sortBy,

      order,
    };
  }
}
