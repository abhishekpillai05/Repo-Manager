import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audit_log')
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  actor!: string;

  @Column()
  actionType!: string;

  @Column()
  targetRepo!: string;

  @Column({ type: 'timestamptz' })
  timestampUtc!: Date;

  @Column()
  ipAddress!: string;
}
