import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AuditLogEntity } from '../../database/entities/audit-log.entity';
import { AuditAction } from './audit-action.enum';
import { AuditQueryDto } from './dto/audit-query.dto';

export interface LogAuditDto {
  userId?: string | null;
  action: AuditAction;
  repositoryId?: string | null;
  repositoryName?: string | null;
  /** Must never contain passwords, tokens, or secrets. */
  details?: Record<string, unknown> | null;
}

export interface PaginatedAuditResult {
  data: AuditLogEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditRepository: Repository<AuditLogEntity>,
  ) {}

  /**
   * Persists a single audit event.
   * Called by ConfigController, and available to Engineers C and D via injection.
   */
  async log(dto: LogAuditDto): Promise<AuditLogEntity> {
    try {
      const entry = this.auditRepository.create({
        userId: dto.userId ?? null,
        action: dto.action,
        repositoryId: dto.repositoryId ?? null,
        repositoryName: dto.repositoryName ?? null,
        details: dto.details ?? null,
      });
      return await this.auditRepository.save(entry);
    } catch (err) {
      this.logger.error('Failed to persist audit log entry', err);
      throw new InternalServerErrorException('Could not save audit log entry');
    }
  }

  /**
   * Returns paginated audit logs with optional filters.
   * Used by GET /audit.
   */
  async findAll(query: AuditQueryDto): Promise<PaginatedAuditResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.buildFilterQuery(query);
    const [data, total] = await qb
      .orderBy('log.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Returns all matching audit logs as a CSV string.
   * Used by GET /audit/export.
   */
  async exportCsv(query: AuditQueryDto): Promise<string> {
    const qb = this.buildFilterQuery(query);
    const logs = await qb.orderBy('log.createdAt', 'DESC').getMany();
    return this.buildCsvString(logs);
  }

  private buildFilterQuery(
    query: AuditQueryDto,
  ): SelectQueryBuilder<AuditLogEntity> {
    const qb = this.auditRepository.createQueryBuilder('log');

    if (query.userId) {
      qb.andWhere('log.userId = :userId', { userId: query.userId });
    }
    if (query.action) {
      qb.andWhere('log.action = :action', { action: query.action });
    }
    if (query.repositoryId) {
      qb.andWhere('log.repositoryId = :repositoryId', {
        repositoryId: query.repositoryId,
      });
    }
    if (query.startDate) {
      qb.andWhere('log.createdAt >= :startDate', {
        startDate: new Date(query.startDate),
      });
    }
    if (query.endDate) {
      qb.andWhere('log.createdAt <= :endDate', {
        endDate: new Date(query.endDate),
      });
    }

    return qb;
  }

  /**
   * Builds a safe RFC-4180-compliant CSV string.
   * The details column is serialised as JSON; all values are double-quoted
   * and internal double-quotes are escaped. No sensitive data is emitted here
   * because the entity's details field must never store credentials.
   */
  private buildCsvString(logs: AuditLogEntity[]): string {
    const header = 'id,userId,action,repositoryId,repositoryName,details,createdAt';

    const escape = (value: unknown): string => {
      if (value === null || value === undefined) return '""';
      const raw =
        typeof value === 'object'
          ? JSON.stringify(value)
          : String(value);
      return `"${raw.replace(/"/g, '""')}"`;
    };

    const rows = logs.map((log) =>
      [
        escape(log.id),
        escape(log.userId),
        escape(log.action),
        escape(log.repositoryId),
        escape(log.repositoryName),
        escape(log.details),
        escape(log.createdAt?.toISOString()),
      ].join(','),
    );

    return [header, ...rows].join('\n');
  }
}
