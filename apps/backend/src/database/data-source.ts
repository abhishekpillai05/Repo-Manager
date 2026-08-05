import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AuditLogEntity } from './entities/audit-log.entity';
import { RepoOverrideEntity } from './entities/repo-override.entity';
import { SystemConfigEntity } from './entities/system-config.entity';

/**
 * AppDataSource is used by the TypeORM CLI for running migrations.
 * The NestJS application uses TypeOrmModule.forRootAsync() in app.module.ts.
 *
 * Required environment variables (set in .env or shell before running migrations):
 *   DATABASE_HOST, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DATABASE_HOST'] ?? 'localhost',
  port: parseInt(process.env['DATABASE_PORT'] ?? '5432', 10),
  username: process.env['DATABASE_USERNAME'] ?? 'postgres',
  password: process.env['DATABASE_PASSWORD'] ?? 'postgres',
  database: process.env['DATABASE_NAME'] ?? 'pt_repo_manager',
  entities: [SystemConfigEntity, RepoOverrideEntity, AuditLogEntity],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env['NODE_ENV'] !== 'production',
});
