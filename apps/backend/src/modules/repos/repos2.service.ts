import { Injectable } from '@nestjs/common';
import { LifeCycleService } from '../lifecycle/lifecycle.service';
import { RepositoryStatus } from "../lifecycle/repository-status.enum";
// import { RepoSummary } from '../../../../../packages/shared-types/src/repo.interface';

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const VALID_ROLES = [
    "fed",
    "react",
    "backend",
    "system-architect"
];

@Injectable()
export class ReposService {

    constructor(
        private readonly lifecycleService: LifeCycleService,
    ) {}

    private calculateDaysSinceCreation(
    createdAt: Date,
    today: Date
    ): number {

        const differenceInMilliseconds =
            today.getTime() - createdAt.getTime();

        const differenceInDays =
            differenceInMilliseconds / MILLISECONDS_PER_DAY;

        return Math.floor(differenceInDays);
    }

    private parseRole(
    repositoryName: string,
    repoPrefix: string
    ): string 
    {

        const normalizedRepositoryName = repositoryName.toLowerCase();
        const normalizedRepoPrefix = repoPrefix.toLowerCase();

        // Remove the configurable prefix
        const nameWithoutPrefix =
            normalizedRepositoryName.replace(normalizedRepoPrefix, "");

        // Split into parts
        const parts = nameWithoutPrefix.split("-");

        let currentRole = "";

        for (let i = 0; i < parts.length; i++) {

            currentRole =
                currentRole === ""
                    ? parts[i]
                    : `${currentRole}-${parts[i]}`;

            if (VALID_ROLES.includes(currentRole)) {
                return currentRole;
            }
        }

        console.warn(`Unknown role found in repository: ${repositoryName}`);

        return "Unknown";
    }

    private parseCandidateName(
    repositoryName: string,
    repoPrefix: string,
    role: string
): string {

    const normalizedRepositoryName = repositoryName.toLowerCase();
    const normalizedRepoPrefix = repoPrefix.toLowerCase();
    const normalizedRole = role.toLowerCase();

    // Remove the configurable prefix
    const nameWithoutPrefix =
        normalizedRepositoryName.startsWith(normalizedRepoPrefix)
            ? normalizedRepositoryName.substring(normalizedRepoPrefix.length)
            : normalizedRepositoryName;

    // Remove the role
    const candidatePart =
        nameWithoutPrefix.startsWith(normalizedRole + "-")
            ? nameWithoutPrefix.substring(normalizedRole.length + 1)
            : nameWithoutPrefix;

    // Convert
    return candidatePart
        .split("-")
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
    }

    private mapRepositoryStatus(
    status: RepositoryStatus
    ): "Live" | "Archived" | "Pending Deletion" {

        switch (status) {

            case RepositoryStatus.ACTIVE:
                return "Live";

            case RepositoryStatus.WARNING:
                return "Pending Deletion";

            case RepositoryStatus.EXPIRED:
                return "Pending Deletion";

            case RepositoryStatus.ARCHIVED:
                return "Archived";

            default:
                return "Pending Deletion";
        }
    }

    private async buildRepoSummary(
    repository: any,
    repoPrefix: string,
    // retentionDays: number,
    // warningDays: number,
    today: Date
    ):Promise<any> {

        // ===========================================
    // TODO: Get effective retention period
    // Engineer B
    // const retentionDays =
    //     await this.repoOverrideService.getEffectiveRetentionDays(repository.id);
    // ===========================================


    // ===========================================
    // TODO: Get global configuration
    // Engineer B
    // const config =
    //     await this.systemConfigService.getOrCreateDefaultConfig();
    //
    // const warningDays = config.warningDays;
    // ===========================================
    
        const role =
    this.parseRole(
        repository.name,
        repoPrefix
    );

    const candidateName =
        this.parseCandidateName(
            repository.name,
            repoPrefix,
            role
        );

    const daysSinceCreation =
        this.calculateDaysSinceCreation(
            new Date(repository.createdAt),
            today
        );

    }
}
