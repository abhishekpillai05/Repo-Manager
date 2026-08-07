import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AppConfigService } from '../../config/app-config.service';
import { SessionStoreService } from '../../modules/auth/services/session-store.service';

export interface RequestUser {
  githubUsername: string;
  sessionId: string;
  githubAccessToken?: string;
  ipAddress?: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfig: AppConfigService,
    private readonly sessionStoreService: SessionStoreService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookieOrHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.appConfig.jwtSecret,
      });

      if (!payload.githubUsername || !payload.sessionId) {
        throw new UnauthorizedException('Invalid JWT payload');
      }

      // Try to get GitHub token from session store first (most up-to-date)
      // Fall back to the token embedded in the JWT (survives backend restarts)
      const session = this.sessionStoreService.getSession(payload.sessionId);
      const githubAccessToken = session?.githubAccessToken ?? payload.githubAccessToken;

      // Attach user information & IP address to request
      const clientIp =
        (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
        request.socket?.remoteAddress ||
        '';

      (request as any).user = {
        githubUsername: payload.githubUsername,
        sessionId: payload.sessionId,
        githubAccessToken,
        ipAddress: clientIp,
      } as RequestUser;

      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }

  private extractTokenFromCookieOrHeader(request: Request): string | null {
    // 1. Read from httpOnly cookie
    if (request.cookies && request.cookies.pt_auth_token) {
      return request.cookies.pt_auth_token;
    }
    if (request.cookies && request.cookies.jwt) {
      return request.cookies.jwt;
    }

    // 2. Authorization Header fallback
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return null;
  }
}

// Alias for backward compatibility with modules importing AuthGuard
export { JwtAuthGuard as AuthGuard };

