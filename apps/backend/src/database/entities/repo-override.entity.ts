import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('repo_override')
export class RepoOverrideEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  repositoryId!: string;

  @Column({ type: 'varchar' })
  repositoryName!: string;

  /**
   * When null the repository inherits the global SystemConfig.retentionDays.
   */
  @Column({ type: 'int', nullable: true })
  retentionDays!: number | null;

  @Column({ type: 'text', nullable: true })
  reason!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
