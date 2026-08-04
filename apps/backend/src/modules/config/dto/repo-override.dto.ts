import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateRepoOverrideDto {
  @IsString()
  @IsNotEmpty()
  repositoryId!: string;

  @IsString()
  @IsNotEmpty()
  repositoryName!: string;

  /**
   * Override retention in days.
   * Omit or set to null to inherit the global SystemConfig.retentionDays.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  retentionDays?: number | null;

  @IsOptional()
  @IsString()
  reason?: string | null;
}

export class UpdateRepoOverrideDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  repositoryName?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  retentionDays?: number | null;

  @IsOptional()
  @IsString()
  reason?: string | null;
}
