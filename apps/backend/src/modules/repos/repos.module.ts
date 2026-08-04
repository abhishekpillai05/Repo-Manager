import { Module } from "@nestjs/common";
import { RepoController } from "./repo.controller";
import { ReposService } from "./repos.service";

@Module({
  controllers: [RepoController],
  providers: [ReposService],
})
export class ReposModule {}
