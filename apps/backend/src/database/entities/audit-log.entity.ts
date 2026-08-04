import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_log')
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  userId!: string | null;

  @Index()
  @Column({ type: 'varchar' })
  action!: string;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  repositoryId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  repositoryName!: string | null;

  /**
   * Arbitrary JSON payload for the audit event.
   */
  @Column({ type: 'jsonb', nullable: true })
  details!: Record<string, unknown> | null;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
