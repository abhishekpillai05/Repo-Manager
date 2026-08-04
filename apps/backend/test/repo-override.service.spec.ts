import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepoOverrideEntity } from '../src/database/entities/repo-override.entity';
import { SystemConfigEntity } from '../src/database/entities/system-config.entity';
import { RepoOverrideService } from '../src/modules/config/repo-override.service';
import { SystemConfigService } from '../src/modules/config/system-config.service';

const makeOverride = (
  overrides: Partial<RepoOverrideEntity> = {},
): RepoOverrideEntity => ({
  id: 'override-uuid',
  repositoryId: 'repo-123',
  repositoryName: 'my-repo',
  retentionDays: 60,
  reason: 'Special project',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const makeGlobalConfig = (): SystemConfigEntity => ({
  id: 'cfg-uuid',
  retentionDays: 30,
  autoDeleteEnabled: false,
  autoArchiveEnabled: false,
  warningDays: 7,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const makeOverrideRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

const makeSystemConfigService = () => ({
  getOrCreateDefaultConfig: jest.fn().mockResolvedValue(makeGlobalConfig()),
});

describe('RepoOverrideService', () => {
  let service: RepoOverrideService;
  let overrideRepo: ReturnType<typeof makeOverrideRepo>;
  let systemConfigService: ReturnType<typeof makeSystemConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepoOverrideService,
        {
          provide: getRepositoryToken(RepoOverrideEntity),
          useFactory: makeOverrideRepo,
        },
        { provide: SystemConfigService, useFactory: makeSystemConfigService },
      ],
    }).compile();

    service = module.get(RepoOverrideService);
    overrideRepo = module.get(getRepositoryToken(RepoOverrideEntity));
    systemConfigService = module.get(SystemConfigService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── getAllOverrides ────────────────────────────────────────────────────────

  describe('getAllOverrides()', () => {
    it('returns all overrides ordered by createdAt DESC', async () => {
      const overrides = [makeOverride()];
      overrideRepo.find.mockResolvedValue(overrides);

      const result = await service.getAllOverrides();

      expect(overrideRepo.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(overrides);
    });
  });

  // ── getOverride ───────────────────────────────────────────────────────────

  describe('getOverride()', () => {
    it('returns the override for a known repositoryId', async () => {
      const override = makeOverride();
      overrideRepo.findOne.mockResolvedValue(override);

      expect(await service.getOverride('repo-123')).toBe(override);
    });

    it('throws NotFoundException for an unknown repositoryId', async () => {
      overrideRepo.findOne.mockResolvedValue(null);

      await expect(service.getOverride('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── createOverride ────────────────────────────────────────────────────────

  describe('createOverride()', () => {
    it('creates and saves a new override', async () => {
      const override = makeOverride();
      overrideRepo.findOne.mockResolvedValue(null);
      overrideRepo.create.mockReturnValue(override);
      overrideRepo.save.mockResolvedValue(override);

      const result = await service.createOverride({
        repositoryId: 'repo-123',
        repositoryName: 'my-repo',
        retentionDays: 60,
        reason: 'Special project',
      });

      expect(result).toBe(override);
      expect(overrideRepo.create).toHaveBeenCalledWith({
        repositoryId: 'repo-123',
        repositoryName: 'my-repo',
        retentionDays: 60,
        reason: 'Special project',
      });
    });

    it('creates override with null retentionDays (inherits global)', async () => {
      const override = makeOverride({ retentionDays: null });
      overrideRepo.findOne.mockResolvedValue(null);
      overrideRepo.create.mockReturnValue(override);
      overrideRepo.save.mockResolvedValue(override);

      const result = await service.createOverride({
        repositoryId: 'repo-123',
        repositoryName: 'my-repo',
      });

      expect(overrideRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ retentionDays: null }),
      );
      expect(result.retentionDays).toBeNull();
    });

    it('throws ConflictException when override already exists', async () => {
      overrideRepo.findOne.mockResolvedValue(makeOverride());

      await expect(
        service.createOverride({
          repositoryId: 'repo-123',
          repositoryName: 'my-repo',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ── updateOverride ────────────────────────────────────────────────────────

  describe('updateOverride()', () => {
    it('updates retentionDays on an existing override', async () => {
      const existing = makeOverride({ retentionDays: 60 });
      overrideRepo.findOne.mockResolvedValue(existing);
      overrideRepo.save.mockResolvedValue({ ...existing, retentionDays: 90 });

      const result = await service.updateOverride('repo-123', {
        retentionDays: 90,
      });

      expect(result.retentionDays).toBe(90);
    });

    it('sets retentionDays to null (revert to global inherit)', async () => {
      const existing = makeOverride({ retentionDays: 60 });
      overrideRepo.findOne.mockResolvedValue(existing);
      overrideRepo.save.mockImplementation(async (e) => e as RepoOverrideEntity);

      const result = await service.updateOverride('repo-123', {
        retentionDays: null,
      });

      expect(result.retentionDays).toBeNull();
    });

    it('throws NotFoundException when override does not exist', async () => {
      overrideRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateOverride('unknown', { retentionDays: 90 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── deleteOverride ────────────────────────────────────────────────────────

  describe('deleteOverride()', () => {
    it('removes the override entity', async () => {
      const override = makeOverride();
      overrideRepo.findOne.mockResolvedValue(override);
      overrideRepo.remove.mockResolvedValue(override);

      await service.deleteOverride('repo-123');

      expect(overrideRepo.remove).toHaveBeenCalledWith(override);
    });

    it('throws NotFoundException when override does not exist', async () => {
      overrideRepo.findOne.mockResolvedValue(null);

      await expect(service.deleteOverride('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── getEffectiveRetentionDays ─────────────────────────────────────────────

  describe('getEffectiveRetentionDays()', () => {
    it('returns override.retentionDays when a specific override exists', async () => {
      overrideRepo.findOne.mockResolvedValue(makeOverride({ retentionDays: 60 }));

      expect(await service.getEffectiveRetentionDays('repo-123')).toBe(60);
      expect(systemConfigService.getOrCreateDefaultConfig).not.toHaveBeenCalled();
    });

    it('falls back to global config when no override is found', async () => {
      overrideRepo.findOne.mockResolvedValue(null);

      expect(await service.getEffectiveRetentionDays('repo-999')).toBe(30);
      expect(systemConfigService.getOrCreateDefaultConfig).toHaveBeenCalled();
    });

    it('falls back to global config when override.retentionDays is null', async () => {
      overrideRepo.findOne.mockResolvedValue(
        makeOverride({ retentionDays: null }),
      );

      expect(await service.getEffectiveRetentionDays('repo-123')).toBe(30);
      expect(systemConfigService.getOrCreateDefaultConfig).toHaveBeenCalled();
    });
  });
});
