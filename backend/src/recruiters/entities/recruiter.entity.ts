import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity('recruiters')
export class Recruiter {
  @PrimaryGeneratedColumn({ name: 'recruiter_id' })
  recruiterId: number;

  @Column({ name: 'recruiter_name', type: 'varchar', length: 150, unique: true })
  recruiterName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Application, (application) => application.recruiter)
  applications: Application[];
}
