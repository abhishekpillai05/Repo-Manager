import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('system_config')
export class SystemConfigEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  key!: string;

  @Column('text')
  value!: string;
}
