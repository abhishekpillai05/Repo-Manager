import { Module } from '@nestjs/common';

import { SchedulerService } from './scheduler.service';

import { GithubModule } from '../github/github.module';
import { ConfigManagementModule } from '../config/config.module';
import { LifecycleModule } from '../lifecycle/lifecycle.module';

@Module({
  imports: [
    GithubModule,
    ConfigManagementModule,
    LifecycleModule,
  ],
  providers: [
    SchedulerService,
  ],
})
export class SchedulerModule {}