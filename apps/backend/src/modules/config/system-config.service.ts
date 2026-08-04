import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfigEntity } from '../../database/entities/system-config.entity';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class SystemConfigService {
  private readonly logger = new Logger(SystemConfigService.name);

  constructor(
    @InjectRepository(SystemConfigEntity)
    private readonly configRepository: Repository<SystemConfigEntity>,
  ) {}

  /**
   * Returns the current global config.
   * If no record exists, creates one with sensible defaults.
   */
  async getConfig(): Promise<SystemConfigEntity> {
    return this.getOrCreateDefaultConfig();
  }

  /**
   * Returns the existing global config or creates a default one.
   * Public so Engineers C and D can read config without touching the DB directly.
   */
  async getOrCreateDefaultConfig(): Promise<SystemConfigEntity> {
    const existing = await this.configRepository.findOne({ where: {} });
    if (existing) return existing;

    this.logger.log('No SystemConfig found — seeding default configuration');
    const config = this.configRepository.create({
      retentionDays: 30,
      autoDeleteEnabled: false,
      autoArchiveEnabled: false,
      warningDays: 7,
    });
    return this.configRepository.save(config);
  }

  /**
   * Applies a partial update to the global config.
   * Validates cross-field constraints: warningDays must not exceed retentionDays.
   */
  async updateConfig(dto: UpdateConfigDto): Promise<SystemConfigEntity> {
    const config = await this.getOrCreateDefaultConfig();

    const retentionDays = dto.retentionDays ?? config.retentionDays;
    const warningDays = dto.warningDays ?? config.warningDays;

    if (warningDays > retentionDays) {
      throw new BadRequestException(
        `warningDays (${warningDays}) must not exceed retentionDays (${retentionDays})`,
      );
    }

    config.retentionDays = retentionDays;
    config.autoDeleteEnabled = dto.autoDeleteEnabled ?? config.autoDeleteEnabled;
    config.autoArchiveEnabled = dto.autoArchiveEnabled ?? config.autoArchiveEnabled;
    config.warningDays = warningDays;

    return this.configRepository.save(config);
  }
}
