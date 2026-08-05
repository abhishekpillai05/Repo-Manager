import { Module } from '@nestjs/common';
import { LifecycleModule } from '../lifecycle/lifecycle.module';
import { ReposService } from './repos.service';

@Module({
    imports: [
        LifecycleModule,
    ],
    providers: [
        ReposService,
    ],
})
export class ReposModule {}
