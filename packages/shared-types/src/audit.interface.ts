import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export enum AuditActionType {
  ACCESS_REVOKED = 'ACCESS_REVOKED',
  REPO_ARCHIVED = 'REPO_ARCHIVED',
  REPO_DELETED = 'REPO_DELETED',
  RETENTION_UPDATED = 'RETENTION_UPDATED',
  MANUAL_OVERRIDE = 'MANUAL_OVERRIDE',
  SYSTEM_AUTO_ARCHIVE = 'SYSTEM_AUTO_ARCHIVE',
  SYSTEM_AUTO_DELETE = 'SYSTEM_AUTO_DELETE',
  SYSTEM_AUTO_REVOKE = 'SYSTEM_AUTO_REVOKE',
}

export interface AuditLogEntryDto {
  id: string;
  actor: string;
  actionType: AuditActionType | string;
  targetRepo: string | null;
  timestamp: string;
  ipAddress: string;
  metadata?: unknown;
}

export class AuditLogFilterQueryDto {
  @IsString()
  @IsOptional()
  actor?: string;

  @IsString()
  @IsOptional()
  actionType?: string;

  @IsString()
  @IsOptional()
  targetRepo?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;
}
