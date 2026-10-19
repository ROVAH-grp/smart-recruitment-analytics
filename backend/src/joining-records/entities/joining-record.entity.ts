import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity('joining_records')
export class JoiningRecord {
  @PrimaryGeneratedColumn({ name: 'joining_id', type: 'bigint' })
  joiningId: string;

  @Column({ name: 'application_id', type: 'bigint', unique: true })
  applicationId: string;

  @Column({ name: 'joining_date', type: 'date', nullable: true })
  joiningDate: string | null;

  @Column({
    name: 'joining_status',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  joiningStatus: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Application, (application) => application.joiningRecord, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application: Application;
}
