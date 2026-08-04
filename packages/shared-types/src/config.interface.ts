import { IsString, IsOptional, IsInt, Min, IsIn } from 'class-validator';

export type ExpiryActionType = 'DELETE' | 'ARCHIVE';

export interface SystemConfigDto {
  repoPrefix: string;
  retentionDays: number;
  defaultExpiryAction: ExpiryActionType;
  preDeletionWarningDays: number;
  githubOrgName: string;
}

export class UpdateConfigRequestDto {
  @IsString()
  @IsOptional()
  repoPrefix?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  retentionDays?: number;

  @IsIn(['DELETE', 'ARCHIVE'])
  @IsOptional()
  defaultExpiryAction?: ExpiryActionType;

  @IsInt()
  @Min(0)
  @IsOptional()
  preDeletionWarningDays?: number;

  @IsString()
  @IsOptional()
  githubOrgName?: string;
}
