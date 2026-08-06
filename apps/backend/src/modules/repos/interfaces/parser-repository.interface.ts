/**
 * ParsedRepository
 *
 * Represents the information extracted
 * from a GitHub repository name.
 *
 * Example:
 * Repository Name:
 * pt-backend-john-doe
 *
 * Parsed Result:
 * {
 *   repositoryName: "pt-backend-john-doe",
 *   candidateRole: "backend",
 *   candidateName: "john-doe"
 * }
 *
 * Used by:
 * - repo-parser.ts
 * - ReposService
 */
export interface ParsedRepository {
  /**
   * Original GitHub repository name.
   */
  repositoryName: string;

  /**
   * Candidate role extracted from
   * the repository name.
   */
  candidateRole: string;

  /**
   * Candidate name extracted from
   * the repository name.
   */
  candidateName: string;
}