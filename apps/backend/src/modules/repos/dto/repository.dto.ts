/**
 * RepositoryDto
 *
 * Response returned by GET /repos.
 *
 * This DTO is consumed directly by the frontend dashboard.
 *
 * Data Sources:
 * - GitHub
 * - System Configuration
 * - Repository Overrides
 * - Calculated fields
 *
 * Owner:
 * Engineer C (Repository Module)
 */

import { AccessStatus } from "../enums/access-status.enum";
import { CountdownColor } from "../enums/countdown-color.enum";
import { RepoStatus } from "../enums/repo-status.enum";

export class RepositoryDto {
  repositoryName!: string;

  candidateName!: string;

  candidateRole!: string;

  createdAt!: Date;

  daysSinceCreation!: number;

  daysUntilDeletion!: number;

  accessStatus!: AccessStatus;

  repoStatus!: RepoStatus;

  countdownColor!: CountdownColor;
}
