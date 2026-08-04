import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './modules/audit/audit.module';
import { ConfigManagementModule } from './modules/config/config.module';
import { GitHubModule } from './modules/github/github.module';
import { ReposModule } from './modules/repos/repos.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    GitHubModule,
    ReposModule,
    ConfigManagementModule,
    SchedulerModule,
    AuditModule,
  ],
})
export class AppModule {}
