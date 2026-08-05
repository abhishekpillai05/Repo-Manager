import AppDataSource from '../data-source';
import { SystemConfig, ExpiryAction } from '../entities/SystemConfig.entity';

export async function seedSystemConfig() {
  console.log('Seeding default SystemConfig...');
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const repo = AppDataSource.getRepository(SystemConfig);
  const existingConfig = await repo.findOne({ where: { id: '1' } });

  if (!existingConfig) {
    const defaultConfig = repo.create({
      id: '1',
      repoPrefix: 'pt-',
      retentionDays: 90,
      defaultExpiryAction: ExpiryAction.DELETE,
      preDeletionWarningDays: 7,
      githubOrgName: process.env.GITHUB_ORG_NAME || '',
      updatedBy: 'SYSTEM_SEED',
    });
    await repo.save(defaultConfig);
    console.log('Default SystemConfig row seeded successfully.');
  } else {
    console.log('SystemConfig row already exists. Skipping seed.');
  }
}

if (require.main === module) {
  seedSystemConfig()
    .then(() => {
      console.log('Seed completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}
