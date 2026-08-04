/**
 * Access status of external collaborators
 * for a repository.
 *
 * Used by:
 * - RepositoryDto
 * - GET /repos
 */
export enum AccessStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
}