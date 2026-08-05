import { Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ReposService } from "./repos.service";
import { GetRepositoriesQueryDto } from "./dto/get-repositories-query.dto";
import { RepositoryDetailsDto } from "./dto/repository-details.dto";
import { RepositoryDto } from "./dto/repository.dto";
import { CollaboratorDto } from "./dto/collaborator.dto";
import { OperationResponseDto } from "./dto/operation-response.dto";

@Controller("repos")
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

  //after we integrate we'll add explicit return type for this function as : RepositoryDto[]
  @Get()
  getRepositories(@Query() query: GetRepositoriesQueryDto) {
    return this.reposService.getRepositories(query);
  }

  /**
   * Repository Details Endpoint
   *
   * Returns detailed information
   * for a single repository.
   *
   * Example:
   * GET /repos/pt-backend-john-doe
   */
  @Get(":name")
  getRepository(@Param("name") repositoryName: string): RepositoryDetailsDto {
    return this.reposService.getRepository(repositoryName);
  }

  /**
   * Repository Collaborators
   *
   * Returns all collaborators
   * that currently have access
   * to the repository.
   *
   * Example:
   *
   * GET /repos/pt-backend-john-doe/collaborators
   */
  @Get(":name/collaborators")
  getCollaborators(@Param("name") repositoryName: string): CollaboratorDto[] {
    return this.reposService.getCollaborators(repositoryName);
  }

  @Post(":name/archive")
  archiveRepository(
    @Param("name") repositoryName: string,
  ): OperationResponseDto {
    return this.reposService.archiveRepository(repositoryName);
  }

  @Delete(":name")
  deleteRepository(
    @Param("name") repositoryName: string,
  ): OperationResponseDto {
    return this.reposService.deleteRepository(repositoryName);
  }

  /**
   * Remove Repository Collaborator
   *
   * Removes a single collaborator
   * from a repository.
   *
   * Example:
   *
   * DELETE /repos/pt-backend-john-doe/collaborators/john-doe
   */
  @Delete(":name/collaborators/:username")
  removeCollaborator(
    @Param("name") repositoryName: string,

    @Param("username") username: string,
  ): OperationResponseDto {
    return this.reposService.removeCollaborator(repositoryName, username);
  }

  /**
   * Remove All Repository Collaborators
   *
   * Removes all collaborators
   * from a repository.
   *
   * Example:
   *
   * DELETE /repos/pt-backend-john-doe/collaborators
   */
  @Delete(":name/collaborators")
  removeAllCollaborators(
    @Param("name") repositoryName: string,
  ): OperationResponseDto {
    return this.reposService.removeAllCollaborators(repositoryName);
  }
}
