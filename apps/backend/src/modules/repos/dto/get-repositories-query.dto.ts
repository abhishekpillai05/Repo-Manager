import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { RepoStatus } from "../enums/repo-status.enum";
import { AccessStatus } from "../enums/access-status.enum";
import { RepositorySortField } from "../enums/repository-sort-field.enum";
import { SortOrder } from "../enums/sort-order.enum";

/**
 * Query parameters accepted by GET /repos.
 *
 * This DTO validates and transforms
 * incoming query parameters before they
 * reach the service layer.
 */
export class GetRepositoriesQueryDto {
  /**
   * Page number.
   *
   * Example:
   * GET /repos?page=2
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  /**
   * Number of repositories per page.
   *
   * Project default: 50
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  /**
   * Search by candidate name
   * or repository name.
   */
  @IsOptional()
  @IsString()
  search?: string;

  /**
   * Filter by repository status.
   */
  @IsOptional()
  @IsEnum(RepoStatus)
  repoStatus?: RepoStatus;

  /**
   * Filter by collaborator access status.
   */
  @IsOptional()
  @IsEnum(AccessStatus)
  accessStatus?: AccessStatus;

  /**
   * Field used for sorting.
   */
  @IsOptional()
  @IsEnum(RepositorySortField)
  sortBy?: RepositorySortField;

  /**
   * Sort direction.
   */
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}
