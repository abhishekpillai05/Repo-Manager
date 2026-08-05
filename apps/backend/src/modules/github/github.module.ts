import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../../config/app-config.module';
import { SystemConfig } from '../../database/entities/SystemConfig.entity';
import { GithubService } from './github.service';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forFeature([SystemConfig]),
  ],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
