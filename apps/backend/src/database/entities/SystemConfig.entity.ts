import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

export enum ExpiryAction {
  DELETE = 'DELETE',
  ARCHIVE = 'ARCHIVE',
}

@Entity('system_config')
export class SystemConfig {
  @PrimaryColumn({ type: 'varchar', default: '1' })
  id!: string;

  @Column({ type: 'varchar', default: 'pt-' })
  repoPrefix!: string;

  @Column({ type: 'int', default: 90 })
  retentionDays!: number;

  @Column({
    type: 'enum',
    enum: ExpiryAction,
    default: ExpiryAction.DELETE,
  })
  defaultExpiryAction!: ExpiryAction;

  @Column({ type: 'int', default: 7 })
  preDeletionWarningDays!: number;

  @Column({ type: 'varchar', nullable: true })
  githubOrgName?: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'varchar', nullable: true })
  updatedBy?: string;
}
