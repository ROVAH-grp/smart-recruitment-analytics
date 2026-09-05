import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResumeAnalysis } from './resume-analysis.entity';
import { Candidate } from '../../candidates/entities/candidate.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Recruiter } from '../../recruiters/entities/recruiter.entity';
import { Source } from '../../sources/entities/source.entity';
import { Interview } from '../../interviews/entities/interview.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { JoiningRecord } from '../../joining-records/entities/joining-record.entity';

export enum ApplicationStatus {
  APPLIED = 'Applied',
  SCREENED = 'Screened',
  SHORTLISTED = 'Shortlisted',
  INTERVIEWED = 'Interviewed',
  SELECTED = 'Selected',
  OFFERED = 'Offered',
  JOINED = 'Joined',
  REJECTED = 'Rejected',
  WITHDRAWN = 'Withdrawn',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn({ name: 'application_id', type: 'bigint' })
  applicationId!: string;

  @Column({ name: 'candidate_id', type: 'varchar', length: 50 })
 candidateId!: string;

  @Column({ name: 'job_id', type: 'varchar', length: 50 })
  jobId!: string;

  @Column({ name: 'recruiter_id', type: 'int', nullable: true })
  recruiterId!: number | null;

  @Column({ name: 'source_id', type: 'int', nullable: true })
  sourceId!: number | null;

  @Column({ name: 'application_date', type: 'date', nullable: true })
  applicationDate!: string | null;

  @Column({ name: 'screening_date', type: 'date', nullable: true })
  screeningDate!: string | null;

  @Column({ name: 'shortlist_date', type: 'date', nullable: true })
  shortlistDate!: string | null;

  @Column({ name: 'interview_date', type: 'date', nullable: true })
  interviewDate!: string | null;

  @Column({ name: 'selection_date', type: 'date', nullable: true })
  selectionDate!: string | null;

  @Column({ name: 'offer_date', type: 'date', nullable: true })
  offerDate!: string | null;

  @Column({ name: 'joining_date', type: 'date', nullable: true })
  joiningDate!: string | null;

  @Column({ name: 'status', type: 'varchar', length: 50, nullable: true })
  status!: string | null;

  @Column({
    name: 'match_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  matchScore!: string | null;

 @Column({
  name: 'recruitment_cost',
  type: 'decimal',
  precision: 12,
  scale: 2,
  nullable: true,
})
recruitmentCost!: string | null;

@Column({
  name: 'resume_filename',
  type: 'varchar',
  length: 255,
  nullable: true,
})
resumeFilename!: string | null;

@Column({
  name: 'resume_url',
  type: 'text',
  nullable: true,
})
resumeUrl!: string | null;

@Column({
  name: 'resume_public_id',
  type: 'varchar',
  length: 500,
  nullable: true,
})
resumePublicId!: string | null;

@CreateDateColumn({ name: 'created_at' })
createdAt!: Date;

  @ManyToOne(() => Candidate, (candidate) => candidate.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate!: Candidate;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job!: Job;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.applications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'recruiter_id' })
  recruiter!: Recruiter | null;

  @ManyToOne(() => Source, (source) => source.applications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'source_id' })
  source!: Source | null;

  @OneToOne(() => Interview, (interview) => interview.application)
  interview!: Interview;

  @OneToOne(() => Offer, (offer) => offer.application)
  offer!: Offer;

  @OneToOne(() => JoiningRecord, (joiningRecord) => joiningRecord.application)
  joiningRecord!: JoiningRecord;

  @OneToOne(
  () => ResumeAnalysis,
  (resumeAnalysis) => resumeAnalysis.application,
)
resumeAnalysis!: ResumeAnalysis;
}
