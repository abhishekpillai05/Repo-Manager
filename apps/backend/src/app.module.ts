import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { GithubModule } from './modules/github/github.module';
import { SchedulerModule } from "./modules/scheduler/scheduler.module";


@Module({
  imports: [
    ScheduleModule.forRoot(),

    AppConfigModule,
    DatabaseModule,
    HealthModule,
    AuthModule,
    GithubModule,
    SchedulerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
