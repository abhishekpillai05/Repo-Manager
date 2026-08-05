import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/app-config.service';
import { SystemConfig } from './entities/SystemConfig.entity';
import { RepoOverride } from './entities/RepoOverride.entity';
import { AuditLog } from './entities/AuditLog.entity';

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
        entities: [SystemConfig, RepoOverride, AuditLog],
        synchronize: false, // Strict: off in all environments
        logging: appConfig.isDevelopment,
      }),
    }),
    TypeOrmModule.forFeature([SystemConfig, RepoOverride, AuditLog]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
