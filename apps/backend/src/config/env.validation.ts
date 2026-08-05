import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  validateSync,
  Min,
  Max,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Min(1)
  @Max(65535)
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsOptional()
  FRONTEND_ORIGIN: string = 'http://localhost:5173';

  // Database
  @IsString()
  @IsOptional()
  DATABASE_HOST: string = 'localhost';

  @IsNumber()
  @IsOptional()
  DATABASE_PORT: number = 5432;

  @IsString()
  @IsOptional()
  DATABASE_USER: string = 'postgres';

  @IsString()
  @IsOptional()
  DATABASE_PASSWORD: string = 'postgres';

  @IsString()
  @IsOptional()
  DATABASE_NAME: string = 'pt_repo_manager';

  // GitHub OAuth
  @IsString()
  @IsOptional()
  GITHUB_OAUTH_CLIENT_ID: string = 'placeholder_client_id';

  @IsString()
  @IsOptional()
  GITHUB_OAUTH_CLIENT_SECRET: string = 'placeholder_client_secret';

  @IsString()
  @IsOptional()
  GITHUB_OAUTH_CALLBACK_URL: string = 'http://localhost:3000/api/auth/github/callback';

  @IsString()
  @IsOptional()
  GITHUB_ORG_NAME: string = 'placeholder_org';

  // JWT & Sessions
  @IsString()
  @IsOptional()
  JWT_SECRET: string = 'default_super_secret_jwt_key_change_in_prod';

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string = '7d';

  @IsString()
  @IsOptional()
  SESSION_COOKIE_SECRET: string = 'default_super_secret_session_cookie_key';
}

export function validateEnvironmentVariables(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((err) => `${err.property}: ${Object.values(err.constraints || {}).join(', ')}`)
      .join('\n');
    throw new Error(`Environment validation failed on startup:\n${errorMessages}`);
  }

  return validatedConfig;
}
