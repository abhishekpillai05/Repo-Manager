import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/app-config.service';
import { SystemConfigEntity } from './entities/system-config.entity';
import { RepoOverrideEntity } from './entities/repo-override.entity';
import { AuditLogEntity } from './entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => ({
        type: 'postgres',
        host: appConfig.databaseHost,
        port: appConfig.databasePort,
        username: appConfig.databaseUser,
        password: appConfig.databasePassword,
        database: appConfig.databaseName,
        entities: [SystemConfigEntity, RepoOverrideEntity, AuditLogEntity],
        synchronize: false, // Strict: off in all environments
        logging: appConfig.isDevelopment,
      }),
    }),
    TypeOrmModule.forFeature([SystemConfigEntity, RepoOverrideEntity, AuditLogEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
