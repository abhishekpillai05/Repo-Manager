import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { AuditActionType } from '@pt-repo-manager/shared-types';

@Entity('audit_log')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_audit_log_actor')
  @Column({ type: 'varchar' })
  actor!: string;

  @Index('idx_audit_log_action_type')
  @Column({ type: 'varchar' })
  actionType!: AuditActionType | string;

  @Column({ type: 'varchar', nullable: true })
  targetRepo?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Index('idx_audit_log_timestamp')
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp!: Date;

  @Column({ type: 'varchar', nullable: true })
  ipAddress?: string;
}
