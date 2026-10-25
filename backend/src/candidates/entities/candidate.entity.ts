import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity('candidates')
export class Candidate {
  @PrimaryColumn({ name: 'candidate_id', type: 'varchar', length: 50 })
  candidateId: string;

  @Column({ name: 'candidate_name', type: 'varchar', length: 150 })
  candidateName: string;

  @Column({
    name: 'experience_years',
    type: 'decimal',
    precision: 4,
    scale: 1,
    nullable: true,
  })
  experienceYears: string | null;

  @Column({ name: 'education', type: 'varchar', length: 150, nullable: true })
  education: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Application, (application) => application.candidate)
  applications: Application[];
}
