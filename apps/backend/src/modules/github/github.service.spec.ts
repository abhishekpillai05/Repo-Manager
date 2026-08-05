import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GithubService, parseRepoName } from './github.service';
import { AppConfigService } from '../../config/app-config.service';
import { SystemConfig } from '../../database/entities/SystemConfig.entity';
import { GithubApiError } from './errors/github-api.error';

describe('GithubService', () => {
  let service: GithubService;

  const mockAppConfigService = {
    githubOrgName: 'test-org',
  };

  const mockSystemConfigRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
        {
          provide: AppConfigService,
          useValue: mockAppConfigService,
        },
        {
          provide: getRepositoryToken(SystemConfig),
          useValue: mockSystemConfigRepository,
        },
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
    jest.clearAllMocks();
  });

  describe('parseRepoName', () => {
    it('should parse "pt-react-aditya-mhatre" correctly', () => {
      const result = parseRepoName('pt-react-aditya-mhatre', 'pt-');
      expect(result).toEqual({
        role: 'react',
        candidateName: 'aditya-mhatre',
      });
    });

    it('should parse "pt-system-architect-rajat-ghildiyal" correctly', () => {
      const result = parseRepoName('pt-system-architect-rajat-ghildiyal', 'pt-');
      expect(result).toEqual({
        role: 'system-architect',
        candidateName: 'rajat-ghildiyal',
      });
    });

    it('should parse "pt-fed-sonam-dubey" correctly', () => {
      const result = parseRepoName('pt-fed-sonam-dubey', 'pt-');
      expect(result).toEqual({
        role: 'fed',
        candidateName: 'sonam-dubey',
      });
    });

    it('should return null for malformed repo names', () => {
      expect(parseRepoName('pt-react', 'pt-')).toBeNull();
      expect(parseRepoName('invalid-repo-name', 'pt-')).toBeNull();
      expect(parseRepoName('pt--aditya-mhatre', 'pt-')).toBeNull();
      expect(parseRepoName('', 'pt-')).toBeNull();
      expect(parseRepoName('pt-aditya-mhatre', 'pt-')).toBeNull(); // missing role segment
    });
  });

  describe('listOrgRepos (Pagination Handling)', () => {
    it('should use Octokit paginate to fetch all organization repositories across pages', async () => {
      const page1 = Array.from({ length: 100 }, (_, i) => ({ name: `pt-role-user-${i}` }));
      const page2 = Array.from({ length: 50 }, (_, i) => ({ name: `pt-role-user-${i + 100}` }));
      const allRepos = [...page1, ...page2];

      const mockOctokit = {
        paginate: jest.fn().mockResolvedValue(allRepos),
        rest: {
          repos: {
            listForOrg: jest.fn(),
          },
        },
      };

      jest.spyOn(service, 'createOctokitClient').mockReturnValue(mockOctokit as any);

      const repos = await service.listOrgRepos('dummy-token');

      expect(repos).toHaveLength(150);
      expect(mockOctokit.paginate).toHaveBeenCalledWith(
        mockOctokit.rest.repos.listForOrg,
        {
          org: 'test-org',
          per_page: 100,
          type: 'all',
        },
      );
    });
  });

  describe('executeWithResilience (Rate Limit & Exponential Backoff Retry)', () => {
    it('should retry on 403 rate limit response with retry-after header and succeed', async () => {
      let callCount = 0;
      const rateLimitError: any = new Error('API rate limit exceeded');
      rateLimitError.status = 403;
      rateLimitError.response = {
        headers: {
          'retry-after': '0', // 0 seconds for instant test execution
        },
      };

      const mockFn = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(rateLimitError);
        }
        return Promise.resolve({ data: 'success' });
      });

      const mockOctokit = {} as any;
      jest.spyOn(service, 'createOctokitClient').mockReturnValue(mockOctokit);

      const result = await service.executeWithResilience(mockFn, 'dummy-token', 3);

      expect(result).toEqual({ data: 'success' });
      expect(callCount).toBe(2);
    });

    it('should throw GithubApiError when max retries are exhausted on rate limit', async () => {
      const rateLimitError: any = new Error('Secondary rate limit reached');
      rateLimitError.status = 403;
      rateLimitError.response = {
        headers: {
          'retry-after': '0',
        },
      };

      const mockFn = jest.fn().mockRejectedValue(rateLimitError);
      const mockOctokit = {} as any;
      jest.spyOn(service, 'createOctokitClient').mockReturnValue(mockOctokit);

      await expect(service.executeWithResilience(mockFn, 'dummy-token', 2)).rejects.toThrow(
        GithubApiError,
      );
    });
  });
});
