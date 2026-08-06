import { Module } from '@nestjs/common';
import { LifeCycleService } from './lifecycle.service';

@Module({
    providers: [LifeCycleService],
    exports: [LifeCycleService],
})
export class LifecycleModule {}