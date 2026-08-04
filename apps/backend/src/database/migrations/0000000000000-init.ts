import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init0000000000000 implements MigrationInterface {
  name = 'Init0000000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS system_config (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        key text NOT NULL UNIQUE,
        value text NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS repo_override (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        repoName text NOT NULL,
        deletionDate timestamptz NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        actor text NOT NULL,
        actionType text NOT NULL,
        targetRepo text NOT NULL,
        timestampUtc timestamptz NOT NULL,
        ipAddress text NOT NULL
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS audit_log');
    await queryRunner.query('DROP TABLE IF EXISTS repo_override');
    await queryRunner.query('DROP TABLE IF EXISTS system_config');
  }
}
