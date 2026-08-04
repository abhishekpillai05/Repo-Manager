import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchemaAndAuditImmutability1700000000000
  implements MigrationInterface
{
  name = 'InitialSchemaAndAuditImmutability1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create system_config table
    await queryRunner.query(`
      CREATE TABLE "system_config" (
        "id" varchar NOT NULL DEFAULT '1',
        "repoPrefix" varchar NOT NULL DEFAULT 'pt-',
        "retentionDays" integer NOT NULL DEFAULT 90,
        "defaultExpiryAction" varchar NOT NULL DEFAULT 'DELETE',
        "preDeletionWarningDays" integer NOT NULL DEFAULT 7,
        "githubOrgName" varchar,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedBy" varchar,
        CONSTRAINT "PK_system_config_id" PRIMARY KEY ("id")
      );
    `);

    // 2. Create repo_override table
    await queryRunner.query(`
      CREATE TABLE "repo_override" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "repoName" varchar NOT NULL,
        "overriddenDeletionDate" TIMESTAMPTZ NOT NULL,
        "setBy" varchar NOT NULL,
        "setAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "reason" text,
        CONSTRAINT "PK_repo_override_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_repo_override_repoName" UNIQUE ("repoName")
      );
    `);

    // 3. Create audit_log table
    await queryRunner.query(`
      CREATE TABLE "audit_log" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "actor" varchar NOT NULL,
        "actionType" varchar NOT NULL,
        "targetRepo" varchar,
        "metadata" jsonb,
        "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "ipAddress" varchar,
        CONSTRAINT "PK_audit_log_id" PRIMARY KEY ("id")
      );
    `);

    // 4. Create Indexes on audit_log
    await queryRunner.query(`
      CREATE INDEX "idx_audit_log_actor" ON "audit_log" ("actor");
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_audit_log_action_type" ON "audit_log" ("actionType");
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_audit_log_timestamp" ON "audit_log" ("timestamp");
    `);

    // 5. Create Trigger function for Audit Log Immutability (Tamper-Evidence)
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION prevent_audit_log_mutation()
      RETURNS TRIGGER AS $$
      BEGIN
        RAISE EXCEPTION 'Audit log entries are immutable and cannot be updated or deleted.';
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER enforce_audit_log_immutability
      BEFORE UPDATE OR DELETE ON "audit_log"
      FOR EACH ROW
      EXECUTE FUNCTION prevent_audit_log_mutation();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS enforce_audit_log_immutability ON "audit_log";
    `);
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS prevent_audit_log_mutation();
    `);
    await queryRunner.query(`DROP TABLE "audit_log";`);
    await queryRunner.query(`DROP TABLE "repo_override";`);
    await queryRunner.query(`DROP TABLE "system_config";`);
  }
}
