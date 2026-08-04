import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemConfigEntity } from '../../database/entities/system-config.entity';
import { RepoOverrideEntity } from '../../database/entities/repo-override.entity';
import { AuditModule } from '../audit/audit.module';
import { ConfigController } from './config.controller';
import { RepoOverrideService } from './repo-override.service';
import { SystemConfigService } from './system-config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemConfigEntity, RepoOverrideEntity]),
    AuditModule,
  ],
  providers: [SystemConfigService, RepoOverrideService],
  controllers: [ConfigController],
  /**
   * Export both services so Engineers C and D can inject them
   * by importing ConfigManagementModule into their own modules.
   *
   * Engineer D (scheduler) usage example:
   *   const days = await repoOverrideService.getEffectiveRetentionDays(repoId);
   *   const config = await systemConfigService.getOrCreateDefaultConfig();
   */
  exports: [SystemConfigService, RepoOverrideService],
})
export class ConfigManagementModule {}
