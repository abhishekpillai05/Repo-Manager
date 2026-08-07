import { Module } from "@nestjs/common";
import { GithubModule } from "../github/github.module";
import { ConfigManagementModule } from "../config/config.module";
import { LifecycleModule } from "../lifecycle/lifecycle.module";
import { AuditModule } from "../audit/audit.module";
import { RepoController } from "./repos.controller";
import { ReposService } from "./repos.service";

@Module({
  imports: [
    GithubModule,
    ConfigManagementModule,
    LifecycleModule,
    AuditModule,
  ],
  controllers: [RepoController],
  providers: [ReposService],
})
export class ReposModule {}
