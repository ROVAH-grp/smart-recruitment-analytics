import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity('jobs')
export class Job {
  @PrimaryColumn({ name: 'job_id', type: 'varchar', length: 50 })
  jobId!: string;

  @Column({ name: 'job_title', type: 'varchar', length: 150 })
  jobTitle!: string;

  @Column({ name: 'department', type: 'varchar', length: 100, nullable: true })
  department!: string | null;

  @Column({ name: 'job_posted_date', type: 'date', nullable: true })
  jobPostedDate!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => Application, (application) => application.job)
  applications!: Application[];

  @Column({ name: 'required_skills', type: 'json', nullable: true })
requiredSkills!: string[] | null;

@Column({
  name: 'required_experience_years',
  type: 'decimal',
  precision: 5,
  scale: 2,
  nullable: true,
})
requiredExperienceYears!: number | null;

@Column({ name: 'required_education', type: 'json', nullable: true })
requiredEducation!: string[] | null;

@Column({
  name: 'required_certifications',
  type: 'json',
  nullable: true,
})
requiredCertifications!: string[] | null;

@Column({
  name: 'preferred_projects_keywords',
  type: 'json',
  nullable: true,
})
preferredProjectsKeywords!: string[] | null;
}
