import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { GithubService } from "../github/github.service";

import { SystemConfigService } from "../config/system-config.service";
import { RepoOverrideService } from "../config/repo-override.service";

import { LifeCycleService } from "../lifecycle/lifecycle.service";
import { RepositoryAction } from "../lifecycle/repository-action.enum";

@Injectable()
export class SchedulerService {

    private readonly logger = new Logger(SchedulerService.name);

    constructor(

        private readonly githubService: GithubService,

        private readonly systemConfigService: SystemConfigService,

        private readonly repoOverrideService: RepoOverrideService,

        private readonly lifecycleService: LifeCycleService,


    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async executeScheduler() {

        this.logger.log("Scheduler started");

        try {

        await this.runScheduler();

        this.logger.log("Scheduler finished");

        }
        catch (error) {

            this.logger.error(
                "Scheduler failed",
                error instanceof Error ? error.stack : String(error),
            );

        }

    }

    private async runScheduler(): Promise<void> {

        // Get global configuration
        const config =
            await this.systemConfigService.getOrCreateDefaultConfig();

        // Exit if automation is disabled
        if (
            !config.autoDeleteEnabled &&
            !config.autoArchiveEnabled
        ) {
            return;
        }

        // Engineer A
        // Already filters repositories and parses names.
        const repositories =
            await this.githubService.getPtRepositories();

        const today = new Date();

        for (const repository of repositories) {

            await this.processRepository(
                repository,
                config,
                today,
            );

        }

    }

    private async processRepository(
        repository: any,
        config: any,
        today: Date,
    ): Promise<void> {

        // Effective retention period
        const retentionDays =
            await this.repoOverrideService.getEffectiveRetentionDays(
                repository.id,
            );

        // Effective deletion date
        const effectiveDeletionDate =
            this.lifecycleService.getEffectiveDeletionDate(
                new Date(repository.createdAt),
                retentionDays,
                null,
            );

        // Days remaining
        const daysRemaining =
            this.lifecycleService.getDaysRemaining(
                effectiveDeletionDate,
                today,
            );

        // Delete repository
        if (
            config.autoDeleteEnabled &&
            this.lifecycleService.shouldDelete(
                daysRemaining,
                RepositoryAction.DELETE,
            )
        ) {

            await this.githubService.deleteRepo(
                repository.name,
            );

            return;
        }

        // Archive repository
        if (
            config.autoArchiveEnabled &&
            this.lifecycleService.shouldArchive(
                daysRemaining,
                RepositoryAction.ARCHIVE,
            )
        ) {

            await this.githubService.archiveRepo(
                repository.name,
            );

            return;
        }

        // Warning window
        if (
            this.lifecycleService.isWarningActive(
                daysRemaining,
                config.warningDays,
            )
        ) {

            // TODO
            // NotificationService.sendWarning(repository);

        }

    }

}
