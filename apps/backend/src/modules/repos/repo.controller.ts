import { Controller, Get, Query } from "@nestjs/common";
import { ReposService } from "./repos.service";
import { GetRepositoriesQueryDto } from "./dto/get-repositories-query.dto";

@Controller("repos")
export class RepoController {
  constructor(private readonly repoService: ReposService) {}

  /**
   * Dashboard endpoint.
   *
   * Returns all PT repositories along with
   * repository metadata required by frontend.
   *
   * GET /repos
   */

  @Get()
  getRepositories(@Query() query: GetRepositoriesQueryDto) {
    return this.repoService.getRepositories(query);
  }
}
