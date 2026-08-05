/**
 * Fields that the repository dashboard
 * can be sorted by.
 *
 * Used by:
 * - GET /repos
 */
export enum RepositorySortField {
  REPOSITORY_NAME = 'repositoryName',

  CANDIDATE_NAME = 'candidateName',

  CREATED_AT = 'createdAt',

  DAYS_UNTIL_DELETION = 'daysUntilDeletion',
}