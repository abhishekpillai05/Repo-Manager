import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('system_config')
export class SystemConfigEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int', default: 30 })
  retentionDays!: number;

  @Column({ type: 'boolean', default: false })
  autoDeleteEnabled!: boolean;

  @Column({ type: 'boolean', default: false })
  autoArchiveEnabled!: boolean;

  @Column({ type: 'int', default: 7 })
  warningDays!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
