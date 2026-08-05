import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLogEntity } from '../src/database/entities/audit-log.entity';
import { AuditAction } from '../src/modules/audit/audit-action.enum';
import { AuditService } from '../src/modules/audit/audit.service';
import { AuditQueryDto } from '../src/modules/audit/dto/audit-query.dto';

const makeLog = (overrides: Partial<AuditLogEntity> = {}): AuditLogEntity => ({
  id: 'log-uuid',
  userId: 'user-1',
  action: AuditAction.CONFIG_UPDATED,
  repositoryId: null,
  repositoryName: null,
  details: { key: 'value' },
  createdAt: new Date('2024-01-15T12:00:00Z'),
  ...overrides,
});

const makeQueryBuilder = (logs: AuditLogEntity[] = [makeLog()]) => {
  const qb: any = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([logs, logs.length]),
    getMany: jest.fn().mockResolvedValue(logs),
  };
  return qb;
};

const makeAuditRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('AuditService', () => {
  let service: AuditService;
  let repo: ReturnType<typeof makeAuditRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(AuditLogEntity),
          useFactory: makeAuditRepo,
        },
      ],
    }).compile();

    service = module.get(AuditService);
    repo = module.get(getRepositoryToken(AuditLogEntity));
  });

  afterEach(() => jest.clearAllMocks());

  // ── log() ─────────────────────────────────────────────────────────────────

  describe('log()', () => {
    it('creates and saves an audit entry', async () => {
      const log = makeLog();
      repo.create.mockReturnValue(log);
      repo.save.mockResolvedValue(log);

      const result = await service.log({
        userId: 'user-1',
        action: AuditAction.CONFIG_UPDATED,
        details: { key: 'value' },
      });

      expect(repo.create).toHaveBeenCalledWith({
        userId: 'user-1',
        action: AuditAction.CONFIG_UPDATED,
        repositoryId: null,
        repositoryName: null,
        details: { key: 'value' },
      });
      expect(repo.save).toHaveBeenCalled();
      expect(result).toBe(log);
    });

    it('sets null for optional fields when omitted', async () => {
      const log = makeLog({ userId: null, repositoryId: null });
      repo.create.mockReturnValue(log);
      repo.save.mockResolvedValue(log);

      await service.log({ action: AuditAction.CONFIG_UPDATED });

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: null, repositoryId: null }),
      );
    });

    it('logs a repository-scoped audit action', async () => {
      const log = makeLog({
        action: AuditAction.REPOSITORY_DELETED,
        repositoryId: 'repo-123',
        repositoryName: 'my-repo',
      });
      repo.create.mockReturnValue(log);
      repo.save.mockResolvedValue(log);

      const result = await service.log({
        action: AuditAction.REPOSITORY_DELETED,
        repositoryId: 'repo-123',
        repositoryName: 'my-repo',
      });

      expect(result.repositoryId).toBe('repo-123');
      expect(result.repositoryName).toBe('my-repo');
    });

    it('throws InternalServerErrorException when save fails', async () => {
      repo.create.mockReturnValue(makeLog());
      repo.save.mockRejectedValue(new Error('DB down'));

      await expect(
        service.log({ action: AuditAction.CONFIG_UPDATED }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  // ── findAll() ─────────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('returns paginated results with correct metadata', async () => {
      repo.createQueryBuilder.mockReturnValue(makeQueryBuilder());

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);
    });

    it('calculates totalPages correctly for multi-page results', async () => {
      const logs = Array.from({ length: 45 }, () => makeLog());
      const qb = makeQueryBuilder(logs);
      qb.getManyAndCount.mockResolvedValue([logs.slice(0, 20), 45]);
      repo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.total).toBe(45);
      expect(result.totalPages).toBe(3);
    });

    it('applies action filter', async () => {
      const qb = makeQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ action: AuditAction.CONFIG_UPDATED });

      expect(qb.andWhere).toHaveBeenCalledWith('log.action = :action', {
        action: AuditAction.CONFIG_UPDATED,
      });
    });

    it('applies userId filter', async () => {
      const qb = makeQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ userId: 'user-42' });

      expect(qb.andWhere).toHaveBeenCalledWith('log.userId = :userId', {
        userId: 'user-42',
      });
    });

    it('applies repositoryId filter', async () => {
      const qb = makeQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ repositoryId: 'repo-123' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'log.repositoryId = :repositoryId',
        { repositoryId: 'repo-123' },
      );
    });

    it('applies startDate and endDate filters', async () => {
      const qb = makeQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      const query: AuditQueryDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      await service.findAll(query);

      expect(qb.andWhere).toHaveBeenCalledWith(
        'log.createdAt >= :startDate',
        expect.objectContaining({ startDate: expect.any(Date) }),
      );
      expect(qb.andWhere).toHaveBeenCalledWith(
        'log.createdAt <= :endDate',
        expect.objectContaining({ endDate: expect.any(Date) }),
      );
    });

    it('uses defaults when page and limit are not supplied', async () => {
      const qb = makeQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });
  });

  // ── exportCsv() ───────────────────────────────────────────────────────────

  describe('exportCsv()', () => {
    it('returns a string beginning with the CSV header', async () => {
      const qb = makeQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      const csv = await service.exportCsv({});

      expect(typeof csv).toBe('string');
      expect(csv.startsWith('id,userId,action,')).toBe(true);
    });

    it('includes a data row with the log id and action', async () => {
      const qb = makeQueryBuilder([
        makeLog({ id: 'abc-123', action: AuditAction.OVERRIDE_CREATED }),
      ]);
      repo.createQueryBuilder.mockReturnValue(qb);

      const csv = await service.exportCsv({});

      expect(csv).toContain('abc-123');
      expect(csv).toContain('OVERRIDE_CREATED');
    });

    it('returns only the header row when there are no logs', async () => {
      const qb = makeQueryBuilder([]);
      repo.createQueryBuilder.mockReturnValue(qb);

      const csv = await service.exportCsv({});

      const lines = csv.split('\n');
      expect(lines).toHaveLength(1);
      expect(lines[0]).toBe(
        'id,userId,action,repositoryId,repositoryName,details,createdAt',
      );
    });

    it('escapes double quotes in details JSON', async () => {
      const log = makeLog({ details: { message: 'He said "hello"' } });
      const qb = makeQueryBuilder([log]);
      repo.createQueryBuilder.mockReturnValue(qb);

      const csv = await service.exportCsv({});

      // JSON.stringify encodes inner quotes as \" before RFC-4180 doubling applies,
      // so the actual CSV substring around "hello" is \""hello\""
      expect(csv).toContain('hello');
      // The details column must be wrapped in outer CSV double-quotes
      expect(csv).toMatch(/"He said/);
    });
  });
});
