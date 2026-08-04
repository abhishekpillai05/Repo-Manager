import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsIn,
  IsNotEmpty,
  IsISO8601,
} from 'class-validator';

export type AccessStatus = 'ACTIVE' | 'REVOKED';
export type RepoStatus = 'LIVE' | 'ARCHIVED' | 'PENDING_DELETION';
export type CollaboratorType = 'OUTSIDE_COLLABORATOR' | 'MEMBER';

export interface RepositoryDto {
  repoId: string;
  repoName: string;
  candidateName: string;
  role: string;
  createdAt: string;
  daysSinceCreation: number;
  daysUntilDeletion: number;
  accessStatus: AccessStatus;
  repoStatus: RepoStatus;
  isPrivate: boolean;
  warningActive: boolean;
}

export interface CollaboratorDto {
  username: string;
  type: CollaboratorType;
  permission: string;
}

export interface RepoOverrideDto {
  repoName: string;
  overriddenDeletionDate: string;
  setBy: string;
  reason?: string;
}

export class SetRepoOverrideRequestDto {
  @IsString()
  @IsNotEmpty()
  repoName!: string;

  @IsISO8601()
  @IsNotEmpty()
  overriddenDeletionDate!: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class RepoFilterQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsIn(['ACTIVE', 'REVOKED'])
  @IsOptional()
  accessStatus?: AccessStatus;

  @IsIn(['LIVE', 'ARCHIVED', 'PENDING_DELETION'])
  @IsOptional()
  repoStatus?: RepoStatus;

  @IsString()
  @IsOptional()
  role?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;
}
