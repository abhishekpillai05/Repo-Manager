import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment, EnvironmentVariables } from './env.validation';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {}

  get nodeEnv(): Environment {
    return this.configService.get('NODE_ENV', { infer: true });
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === Environment.Development;
  }

  get isProduction(): boolean {
    return this.nodeEnv === Environment.Production;
  }

  get port(): number {
    return this.configService.get('PORT', { infer: true });
  }

  get frontendOrigin(): string {
    return this.configService.get('FRONTEND_ORIGIN', { infer: true });
  }

  // Database Properties
  get databaseHost(): string {
    return this.configService.get('DATABASE_HOST', { infer: true });
  }

  get databasePort(): number {
    return this.configService.get('DATABASE_PORT', { infer: true });
  }

  get databaseUser(): string {
    return this.configService.get('DATABASE_USER', { infer: true });
  }

  get databasePassword(): string {
    return this.configService.get('DATABASE_PASSWORD', { infer: true });
  }

  get databaseName(): string {
    return this.configService.get('DATABASE_NAME', { infer: true });
  }

  // GitHub OAuth Properties
  get githubClientId(): string {
    return this.configService.get('GITHUB_OAUTH_CLIENT_ID', { infer: true });
  }

  get githubClientSecret(): string {
    return this.configService.get('GITHUB_OAUTH_CLIENT_SECRET', { infer: true });
  }

  get githubCallbackUrl(): string {
    return this.configService.get('GITHUB_OAUTH_CALLBACK_URL', { infer: true });
  }

  get githubOrgName(): string {
    return this.configService.get('GITHUB_ORG_NAME', { infer: true });
  }

  // Secrets
  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET', { infer: true });
  }

  get jwtExpiresIn(): string {
    return this.configService.get('JWT_EXPIRES_IN', { infer: true });
  }

  get sessionCookieSecret(): string {
    return this.configService.get('SESSION_COOKIE_SECRET', { infer: true });
  }

  /**
   * Returns a sanitized, safe copy of non-sensitive system configuration
   * for diagnostic/health purposes, guaranteeing secrets are NEVER exposed.
   */
  getPublicConfig() {
    return {
      nodeEnv: this.nodeEnv,
      port: this.port,
      frontendOrigin: this.frontendOrigin,
      databaseHost: this.databaseHost,
      databasePort: this.databasePort,
      databaseName: this.databaseName,
      githubClientId: this.githubClientId,
      githubCallbackUrl: this.githubCallbackUrl,
      githubOrgName: this.githubOrgName,
    };
  }
}
