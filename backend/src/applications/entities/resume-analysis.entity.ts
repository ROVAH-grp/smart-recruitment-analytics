import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Application } from './application.entity';

@Entity('resume_analysis')
export class ResumeAnalysis {
  @PrimaryGeneratedColumn({ name: 'analysis_id', type: 'bigint' })
  analysisId!: string;

  @Column({
    name: 'application_id',
    type: 'bigint',
    unique: true,
  })
  applicationId!: string;

  @Column({
    name: 'ats_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  atsScore!: string | null;

  @Column({
    name: 'skills',
    type: 'text',
    nullable: true,
  })
  skills!: string | null;

  @Column({
    name: 'education',
    type: 'text',
    nullable: true,
  })
  education!: string | null;

  @Column({
    name: 'experience',
    type: 'text',
    nullable: true,
  })
  experience!: string | null;

  @Column({
    name: 'projects',
    type: 'text',
    nullable: true,
  })
  projects!: string | null;

  @Column({
    name: 'certifications',
    type: 'text',
    nullable: true,
  })
  certifications!: string | null;

  @Column({
    name: 'parsed_data',
    type: 'json',
    nullable: true,
  })
  parsedData!: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToOne(() => Application, (application) => application.resumeAnalysis, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application!: Application;
}