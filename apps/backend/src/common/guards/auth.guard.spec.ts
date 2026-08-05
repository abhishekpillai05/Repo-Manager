import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth.guard';
import { AppConfigService } from '../../config/app-config.service';
import { SessionStoreService } from '../../modules/auth/services/session-store.service';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: jest.Mocked<JwtService>;
  let appConfig: jest.Mocked<AppConfigService>;
  let sessionStoreService: jest.Mocked<SessionStoreService>;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    } as any;

    appConfig = {
      jwtSecret: 'test_jwt_secret',
    } as any;

    sessionStoreService = {
      getSession: jest.fn(),
    } as any;

    guard = new JwtAuthGuard(jwtService, appConfig, sessionStoreService);
  });

  function createMockExecutionContext(cookies: Record<string, string> = {}, headers: Record<string, string> = {}): ExecutionContext {
    const mockRequest = {
      cookies,
      headers,
      socket: { remoteAddress: '127.0.0.1' },
      user: undefined,
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;
  }

  it('should reject with UnauthorizedException if token is missing', async () => {
    const context = createMockExecutionContext({});
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    await expect(guard.canActivate(context)).rejects.toThrow('Authentication token missing');
  });

  it('should reject with UnauthorizedException if token is expired or tampered', async () => {
    const context = createMockExecutionContext({ pt_auth_token: 'tampered_invalid_token' });
    jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    await expect(guard.canActivate(context)).rejects.toThrow('Invalid or expired authentication token');
  });

  it('should accept valid token and correctly populate request.user', async () => {
    const context = createMockExecutionContext(
      { pt_auth_token: 'valid_jwt_token' },
      { 'x-forwarded-for': '192.168.1.100' },
    );

    jwtService.verifyAsync.mockResolvedValue({
      githubUsername: 'test-lead-engineer',
      sessionId: 'test-session-123',
    });

    sessionStoreService.getSession.mockReturnValue({
      sessionId: 'test-session-123',
      githubUsername: 'test-lead-engineer',
      githubAccessToken: 'gho_mock_access_token',
      createdAt: new Date(),
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);

    const req = context.switchToHttp().getRequest();
    expect(req.user).toEqual({
      githubUsername: 'test-lead-engineer',
      sessionId: 'test-session-123',
      githubAccessToken: 'gho_mock_access_token',
      ipAddress: '192.168.1.100',
    });
  });
});
