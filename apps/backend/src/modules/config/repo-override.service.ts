import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepoOverrideEntity } from '../../database/entities/repo-override.entity';
import { SystemConfigService } from './system-config.service';
import {
  CreateRepoOverrideDto,
  UpdateRepoOverrideDto,
} from './dto/repo-override.dto';

@Injectable()
export class RepoOverrideService {
  constructor(
    @InjectRepository(RepoOverrideEntity)
    private readonly overrideRepository: Repository<RepoOverrideEntity>,
    private readonly systemConfigService: SystemConfigService,
  ) {}

  async getAllOverrides(): Promise<RepoOverrideEntity[]> {
    return this.overrideRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getOverride(repositoryId: string): Promise<RepoOverrideEntity> {
    const override = await this.overrideRepository.findOne({
      where: { repositoryId },
    });
    if (!override) {
      throw new NotFoundException(
        `No retention override found for repository "${repositoryId}"`,
      );
    }
    return override;
  }

  async createOverride(
    dto: CreateRepoOverrideDto,
  ): Promise<RepoOverrideEntity> {
    const existing = await this.overrideRepository.findOne({
      where: { repositoryId: dto.repositoryId },
    });
    if (existing) {
      throw new ConflictException(
        `A retention override for repository "${dto.repositoryId}" already exists. Use PUT to update it.`,
      );
    }

    const override = this.overrideRepository.create({
      repositoryId: dto.repositoryId,
      repositoryName: dto.repositoryName,
      retentionDays: dto.retentionDays ?? null,
      reason: dto.reason ?? null,
    });
    return this.overrideRepository.save(override);
  }

  async updateOverride(
    repositoryId: string,
    dto: UpdateRepoOverrideDto,
  ): Promise<RepoOverrideEntity> {
    const override = await this.getOverride(repositoryId);

    if (dto.repositoryName !== undefined) {
      override.repositoryName = dto.repositoryName;
    }
    if ('retentionDays' in dto) {
      override.retentionDays = dto.retentionDays ?? null;
    }
    if ('reason' in dto) {
      override.reason = dto.reason ?? null;
    }

    return this.overrideRepository.save(override);
  }

  async deleteOverride(repositoryId: string): Promise<void> {
    const override = await this.getOverride(repositoryId);
    await this.overrideRepository.remove(override);
  }

  /**
   * Key integration point for Engineer D's scheduler.
   *
   * Returns the effective retention period for a given repository:
   *   - If a repo-specific override exists with a non-null retentionDays → use that.
   *   - Otherwise (no override, or override.retentionDays === null) → fall back to
   *     the global SystemConfig.retentionDays.
   */
  async getEffectiveRetentionDays(repositoryId: string): Promise<number> {
    const override = await this.overrideRepository.findOne({
      where: { repositoryId },
    });

    if (override !== null && override !== undefined && override.retentionDays !== null) {
      return override.retentionDays;
    }

    const config = await this.systemConfigService.getOrCreateDefaultConfig();
    return config.retentionDays;
  }
}
