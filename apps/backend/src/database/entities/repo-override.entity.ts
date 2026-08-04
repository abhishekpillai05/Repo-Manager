import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('repo_override')
export class RepoOverrideEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  repoName!: string;

  @Column({ type: 'timestamptz' })
  deletionDate!: Date;
}
