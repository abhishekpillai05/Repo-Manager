import { RepositoryDto } from "./repository.dto";

/**
 * Detailed repository information.
 *
 * Returned by:
 * GET /repos/:name
 *
 * Extends the dashboard DTO with
 * additional repository metadata.
 */
export class RepositoryDetailsDto extends RepositoryDto {
  /**
   * GitHub repository URL.
   */
  githubUrl!: string;
}
