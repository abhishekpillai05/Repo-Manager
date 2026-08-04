import { DataSource } from 'typeorm';
import { AuditLogEntity } from './entities/audit-log.entity';
import { RepoOverrideEntity } from './entities/repo-override.entity';
import { SystemConfigEntity } from './entities/system-config.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: '',
  entities: [SystemConfigEntity, RepoOverrideEntity, AuditLogEntity],
  migrations: ['src/database/migrations/*.ts'],
});
