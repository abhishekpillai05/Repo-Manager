import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SystemConfigEntity } from '../src/database/entities/system-config.entity';
import { SystemConfigService } from '../src/modules/config/system-config.service';

const makeConfig = (overrides: Partial<SystemConfigEntity> = {}): SystemConfigEntity => ({
  id: 'cfg-uuid',
  retentionDays: 30,
  autoDeleteEnabled: false,
  autoArchiveEnabled: false,
  warningDays: 7,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const makeRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('SystemConfigService', () => {
  let service: SystemConfigService;
  let repo: ReturnType<typeof makeRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemConfigService,
        { provide: getRepositoryToken(SystemConfigEntity), useFactory: makeRepo },
      ],
    }).compile();

    service = module.get(SystemConfigService);
    repo = module.get(getRepositoryToken(SystemConfigEntity));
  });

  afterEach(() => jest.clearAllMocks());

  // ── getOrCreateDefaultConfig ─────────────────────────────────────────────

  describe('getOrCreateDefaultConfig()', () => {
    it('returns the existing config when one is found', async () => {
      const cfg = makeConfig();
      repo.findOne.mockResolvedValue(cfg);

      const result = await service.getOrCreateDefaultConfig();

      expect(result).toBe(cfg);
      expect(repo.create).not.toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('creates and saves a default config when none exists', async () => {
      const created = makeConfig();
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.getOrCreateDefaultConfig();

      expect(repo.create).toHaveBeenCalledWith({
        retentionDays: 30,
        autoDeleteEnabled: false,
        autoArchiveEnabled: false,
        warningDays: 7,
      });
      expect(repo.save).toHaveBeenCalledWith(created);
      expect(result).toBe(created);
    });
  });

  // ── getConfig ───────────────────────────────────────────────────────────

  describe('getConfig()', () => {
    it('delegates to getOrCreateDefaultConfig()', async () => {
      const cfg = makeConfig();
      repo.findOne.mockResolvedValue(cfg);

      expect(await service.getConfig()).toBe(cfg);
    });
  });

  // ── updateConfig ─────────────────────────────────────────────────────────

  describe('updateConfig()', () => {
    it('saves partial update and returns updated config', async () => {
      const existing = makeConfig({ retentionDays: 30, warningDays: 7 });
      const saved = makeConfig({ retentionDays: 60, warningDays: 7 });
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockResolvedValue(saved);

      const result = await service.updateConfig({ retentionDays: 60 });

      expect(repo.save).toHaveBeenCalled();
      expect(result.retentionDays).toBe(60);
    });

    it('saves boolean flag updates', async () => {
      const existing = makeConfig();
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockResolvedValue({ ...existing, autoDeleteEnabled: true });

      const result = await service.updateConfig({ autoDeleteEnabled: true });

      expect(result.autoDeleteEnabled).toBe(true);
    });

    it('throws BadRequestException when warningDays would exceed retentionDays', async () => {
      repo.findOne.mockResolvedValue(makeConfig({ retentionDays: 30 }));

      await expect(service.updateConfig({ warningDays: 50 })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when new retentionDays falls below existing warningDays', async () => {
      repo.findOne.mockResolvedValue(makeConfig({ retentionDays: 30, warningDays: 20 }));

      await expect(service.updateConfig({ retentionDays: 5 })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('allows warningDays equal to retentionDays', async () => {
      const existing = makeConfig({ retentionDays: 30, warningDays: 7 });
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockResolvedValue({ ...existing, warningDays: 30 });

      const result = await service.updateConfig({ warningDays: 30 });

      expect(result.warningDays).toBe(30);
    });

    it('allows retentionDays of 0 when warningDays is also 0', async () => {
      const existing = makeConfig({ retentionDays: 30, warningDays: 0 });
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockResolvedValue({ ...existing, retentionDays: 0 });

      const result = await service.updateConfig({ retentionDays: 0 });

      expect(result.retentionDays).toBe(0);
    });
  });
});
