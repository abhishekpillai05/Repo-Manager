/**
 * CollaboratorDto
 *
 * Represents a repository collaborator
 * returned by the Repository API.
 *
 * Used by:
 * GET /repos/:name/collaborators
 */
export class CollaboratorDto {
  /**
   * GitHub username.
   */
  username!: string;

  /**
   * Avatar image.
   */
  avatarUrl!: string;

  /**
   * Repository permission.
   *
   * Example:
   * admin
   * write
   * read
   */
  role!: string;

  /**
   * GitHub account type.
   *
   * Example:
   * User
   * Bot
   */
  type!: string;
}
