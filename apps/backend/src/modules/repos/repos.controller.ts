import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthGuard, RequestUser } from "../../common/guards/auth.guard";
import { ReposService } from "./repos.service";
import { GetRepositoriesQueryDto } from "./dto/get-repositories-query.dto";
import { RepositoryDetailsDto } from "./dto/repository-details.dto";
import { RepositoryDto } from "./dto/repository.dto";
import { CollaboratorDto } from "./dto/collaborator.dto";
import { OperationResponseDto } from "./dto/operation-response.dto";

@Controller("repos")
@UseGuards(AuthGuard)
export class RepoController {
  constructor(private readonly reposService: ReposService) {}

  /**
   * Dashboard endpoint.
   *
   * Returns all PT repositories along with
   * repository metadata required by frontend.
   *
   * GET /repos
   */
  @Get()
  getRepositories(
    @Query() query: GetRepositoriesQueryDto,
    @Req() req: Request,
  ): Promise<RepositoryDto[]> {
    const token = (req.user as RequestUser)?.githubAccessToken;
    return this.reposService.getRepositories(query, token);
  }

  /**
   * Repository Details Endpoint
   *
   * Returns detailed information for a single repository.
   *
   * GET /repos/pt-backend-john-doe
   */
  @Get(":name")
  getRepository(
    @Param("name") repositoryName: string,
    @Req() req: Request,
  ): Promise<RepositoryDetailsDto> {
    const token = (req.user as RequestUser)?.githubAccessToken;
    return this.reposService.getRepository(repositoryName, token);
  }

  /**
   * Repository Collaborators
   *
   * Returns all collaborators that currently have access to the repository.
   *
   * GET /repos/pt-backend-john-doe/collaborators
   */
  @Get(":name/collaborators")
  getCollaborators(
    @Param("name") repositoryName: string,
    @Req() req: Request,
  ): Promise<CollaboratorDto[]> {
    const token = (req.user as RequestUser)?.githubAccessToken;
    return this.reposService.getCollaborators(repositoryName, token);
  }

  @Post(":name/archive")
  archiveRepository(
    @Param("name") repositoryName: string,
    @Req() req: Request,
  ): Promise<OperationResponseDto> {
    const user = req.user as RequestUser;
    return this.reposService.archiveRepository(repositoryName, user?.githubAccessToken, user?.githubUsername);
  }

  @Delete(":name")
  deleteRepository(
    @Param("name") repositoryName: string,
    @Req() req: Request,
  ): Promise<OperationResponseDto> {
    const user = req.user as RequestUser;
    return this.reposService.deleteRepository(repositoryName, user?.githubAccessToken, user?.githubUsername);
  }

  /**
   * Remove Repository Collaborator
   *
   * DELETE /repos/pt-backend-john-doe/collaborators/john-doe
   */
  @Delete(":name/collaborators/:username")
  removeCollaborator(
    @Param("name") repositoryName: string,
    @Param("username") username: string,
    @Req() req: Request,
  ): Promise<OperationResponseDto> {
    const user = req.user as RequestUser;
    return this.reposService.removeCollaborator(repositoryName, username, user?.githubAccessToken, user?.githubUsername);
  }

  /**
   * Remove All Repository Collaborators
   *
   * DELETE /repos/pt-backend-john-doe/collaborators
   */
  @Delete(":name/collaborators")
  removeAllCollaborators(
    @Param("name") repositoryName: string,
    @Req() req: Request,
  ): Promise<OperationResponseDto> {
    const user = req.user as RequestUser;
    return this.reposService.removeAllCollaborators(repositoryName, user?.githubAccessToken, user?.githubUsername);
  }
}
