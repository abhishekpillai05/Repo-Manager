import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from './database/entities/audit-log.entity';
import { RepoOverrideEntity } from './database/entities/repo-override.entity';
import { SystemConfigEntity } from './database/entities/system-config.entity';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigManagementModule } from './modules/config/config.module';
import { GitHubModule } from './modules/github/github.module';
import { ReposModule } from './modules/repos/repos.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';

@Module({
  imports: [
    // ── NestJS core ────────────────────────────────────────────────────────────
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),

    // ── Database (Engineer B) ─────────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        username: config.get<string>('DATABASE_USERNAME', 'postgres'),
        password: config.get<string>('DATABASE_PASSWORD', 'postgres'),
        database: config.get<string>('DATABASE_NAME', 'pt_repo_manager'),
        entities: [SystemConfigEntity, RepoOverrideEntity, AuditLogEntity],
        // Migrations are run via CLI (pnpm migration:run) — never synchronize in production.
        synchronize: false,
        logging: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),

    // ── Feature modules ────────────────────────────────────────────────────────
    AuthModule,
    GitHubModule,
    ReposModule,
    ConfigManagementModule,
    SchedulerModule,
    AuditModule,
  ],
})
export class AppModule {}
