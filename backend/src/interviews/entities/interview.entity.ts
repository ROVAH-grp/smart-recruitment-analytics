import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn({ name: 'interview_id', type: 'bigint' })
  interviewId: string;

  @Column({ name: 'application_id', type: 'bigint', unique: true })
  applicationId: string;

  @Column({ name: 'interview_date', type: 'date', nullable: true })
  interviewDate: string | null;

  @Column({
    name: 'technical_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  technicalScore: string | null;

  @Column({
    name: 'communication_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  communicationScore: string | null;

  @Column({
    name: 'problem_solving_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  problemSolvingScore: string | null;

  @Column({
    name: 'overall_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  overallScore: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Application, (application) => application.interview, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application: Application;
}
