import {
  IsBoolean,
  IsInt,
  IsOptional,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateConfigDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  retentionDays?: number;

  @IsOptional()
  @IsBoolean()
  autoDeleteEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  autoArchiveEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ValidateIf((o: UpdateConfigDto) => o.warningDays !== undefined)
  warningDays?: number;
}
