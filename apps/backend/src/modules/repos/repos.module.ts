import { Module } from "@nestjs/common";
import { RepoController } from "./repos.controller";
import { ReposService } from "./repos.service";

@Module({
  controllers: [RepoController],
  providers: [ReposService],
})
export class ReposModule {}
