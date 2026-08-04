import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial schema migration — creates system_config, repo_override, and audit_log tables.
 */
export class Init0000000000000 implements MigrationInterface {
  name = 'Init0000000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS system_config (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "retentionDays" integer NOT NULL DEFAULT 30,
        "autoDeleteEnabled" boolean NOT NULL DEFAULT false,
        "autoArchiveEnabled" boolean NOT NULL DEFAULT false,
        "warningDays" integer NOT NULL DEFAULT 7,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS repo_override (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "repositoryId" varchar NOT NULL,
        "repositoryName" varchar NOT NULL,
        "retentionDays" integer,
        reason text,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_repo_override_repositoryId" UNIQUE ("repositoryId")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" varchar,
        action varchar NOT NULL,
        "repositoryId" varchar,
        "repositoryName" varchar,
        details jsonb,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_log_action" ON audit_log (action)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_log_repositoryId" ON audit_log ("repositoryId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_log_createdAt" ON audit_log ("createdAt")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_log_createdAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_log_repositoryId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_log_action"`);
    await queryRunner.query('DROP TABLE IF EXISTS audit_log');
    await queryRunner.query('DROP TABLE IF EXISTS repo_override');
    await queryRunner.query('DROP TABLE IF EXISTS system_config');
  }
}
