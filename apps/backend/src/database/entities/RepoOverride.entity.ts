import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('repo_override')
export class RepoOverride {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', unique: true })
  repoName!: string;

  @Column({ type: 'timestamptz' })
  overriddenDeletionDate!: Date;

  @Column({ type: 'varchar' })
  setBy!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  setAt!: Date;

  @Column({ type: 'text', nullable: true })
  reason?: string;
}
