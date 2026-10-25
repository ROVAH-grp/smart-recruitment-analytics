import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity('sources')
export class Source {
  @PrimaryGeneratedColumn({ name: 'source_id' })
  sourceId: number;

  @Column({ name: 'source_name', type: 'varchar', length: 100, unique: true })
  sourceName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Application, (application) => application.source)
  applications: Application[];
}
