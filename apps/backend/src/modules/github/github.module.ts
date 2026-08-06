import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../../config/app-config.module';
import { SystemConfigEntity } from '../../database/entities/system-config.entity';
import { GithubService } from './github.service';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forFeature([SystemConfigEntity]),
  ],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
