import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../audit/audit-action.enum';
import { UpdateConfigDto } from './dto/update-config.dto';
import { CreateRepoOverrideDto, UpdateRepoOverrideDto } from './dto/repo-override.dto';
import { SystemConfigService } from './system-config.service';
import { RepoOverrideService } from './repo-override.service';

interface AuthenticatedUser {
  id: string;
  login?: string;
}

@Controller('config')
@UseGuards(AuthGuard)
export class ConfigController {
  constructor(
    private readonly systemConfigService: SystemConfigService,
    private readonly repoOverrideService: RepoOverrideService,
    private readonly auditService: AuditService,
  ) {}

  // ─── Global Config ───────────────────────────────────────────────────────────

  /**
   * GET /config
   * Returns the current global retention & automation configuration.
   */
  @Get()
  getConfig() {
    return this.systemConfigService.getConfig();
  }

  /**
   * PUT /config
   * Partially updates global config and records an audit event.
   */
  @Put()
  async updateConfig(
    @Body() dto: UpdateConfigDto,
    @CurrentUser() user: AuthenticatedUser | undefined,
  ) {
    const oldConfig = await this.systemConfigService.getConfig();
    const newConfig = await this.systemConfigService.updateConfig(dto);

    await this.auditService.log({
      userId: user?.id ?? null,
      action: AuditAction.CONFIG_UPDATED,
      details: {
        before: {
          retentionDays: oldConfig.retentionDays,
          autoDeleteEnabled: oldConfig.autoDeleteEnabled,
          autoArchiveEnabled: oldConfig.autoArchiveEnabled,
          warningDays: oldConfig.warningDays,
        },
        after: {
          retentionDays: newConfig.retentionDays,
          autoDeleteEnabled: newConfig.autoDeleteEnabled,
          autoArchiveEnabled: newConfig.autoArchiveEnabled,
          warningDays: newConfig.warningDays,
        },
      },
    });

    return newConfig;
  }

  // ─── Repository Overrides ─────────────────────────────────────────────────

  /**
   * GET /config/overrides
   * Lists all repo-specific retention overrides.
   */
  @Get('overrides')
  getAllOverrides() {
    return this.repoOverrideService.getAllOverrides();
  }

  /**
   * POST /config/overrides
   * Creates a new override for a repository.
   */
  @Post('overrides')
  async createOverride(
    @Body() dto: CreateRepoOverrideDto,
    @CurrentUser() user: AuthenticatedUser | undefined,
  ) {
    const override = await this.repoOverrideService.createOverride(dto);

    await this.auditService.log({
      userId: user?.id ?? null,
      action: AuditAction.OVERRIDE_CREATED,
      repositoryId: override.repositoryId,
      repositoryName: override.repositoryName,
      details: {
        retentionDays: override.retentionDays,
        reason: override.reason,
      },
    });

    return override;
  }

  /**
   * PUT /config/overrides/:repositoryId
   * Updates an existing override for a repository.
   */
  @Put('overrides/:repositoryId')
  async updateOverride(
    @Param('repositoryId') repositoryId: string,
    @Body() dto: UpdateRepoOverrideDto,
    @CurrentUser() user: AuthenticatedUser | undefined,
  ) {
    const override = await this.repoOverrideService.updateOverride(
      repositoryId,
      dto,
    );

    await this.auditService.log({
      userId: user?.id ?? null,
      action: AuditAction.OVERRIDE_UPDATED,
      repositoryId: override.repositoryId,
      repositoryName: override.repositoryName,
      details: dto as Record<string, unknown>,
    });

    return override;
  }

  /**
   * DELETE /config/overrides/:repositoryId
   * Removes a repository's retention override (it will inherit global config).
   */
  @Delete('overrides/:repositoryId')
  @HttpCode(HttpStatus.OK)
  async deleteOverride(
    @Param('repositoryId') repositoryId: string,
    @CurrentUser() user: AuthenticatedUser | undefined,
  ) {
    const override = await this.repoOverrideService.getOverride(repositoryId);
    await this.repoOverrideService.deleteOverride(repositoryId);

    await this.auditService.log({
      userId: user?.id ?? null,
      action: AuditAction.OVERRIDE_DELETED,
      repositoryId: override.repositoryId,
      repositoryName: override.repositoryName,
    });

    return { message: `Override for repository "${repositoryId}" deleted` };
  }
}
