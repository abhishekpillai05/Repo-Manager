import { RepositoryStatus } from "./repository-status.enum";
import { RepositoryAction } from "./repository-action.enum";

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

export class LifeCycleService
{
    getEffectiveDeletionDate(createdAt: Date, retentionDays: number,
        overrideDeletionDate: Date | null): Date {

        if (overrideDeletionDate) {
            return overrideDeletionDate;
        }

        const deletionDate = new Date(createdAt);

        deletionDate.setDate(
            deletionDate.getDate() + retentionDays
        );

        return deletionDate;
    }

    getDaysRemaining(effectiveDeletionDate: Date, today: Date
    ):number {

        const differenceInMilliseconds =
            effectiveDeletionDate.getTime() - today.getTime();

        const differenceInDays = differenceInMilliseconds / MILLISECONDS_PER_DAY;

        return Math.ceil(differenceInDays);
    };

    isExpired(daysRemaining: number): boolean {
        return daysRemaining < 0;
    }

    isWarningActive(daysRemaining: number, warningThreshold: number): boolean 
    {

        //Repo Expiry Check
        if (this.isExpired(daysRemaining)) {
            return false;
        }

        //Returns true if daysRemaining are less than threshold
        return daysRemaining <= warningThreshold;
    }


    determineRepositoryStatus(
    archived: boolean,
    daysRemaining: number,
    warningThreshold: number
    ): RepositoryStatus {

        //Uses RepositoryStatus enum 
        if (archived) {
            return RepositoryStatus.ARCHIVED;
        }

        //If Expired
        if (this.isExpired(daysRemaining)) {
            return RepositoryStatus.EXPIRED;
        }

        //If in warning state
        if (this.isWarningActive(daysRemaining, warningThreshold)) {
            return RepositoryStatus.WARNING;
        }

        //if active
        return RepositoryStatus.ACTIVE;
    }

    shouldDelete(
    daysRemaining: number,
    defaultAction: RepositoryAction): boolean {

        if (!this.isExpired(daysRemaining)) {
            return false;
        }

        return defaultAction === RepositoryAction.DELETE;
    }

    shouldArchive(
    daysRemaining: number,
    defaultAction: RepositoryAction): boolean {

        if (!this.isExpired(daysRemaining)) {
            return false;
        }

        return defaultAction === RepositoryAction.ARCHIVE;
    }

}