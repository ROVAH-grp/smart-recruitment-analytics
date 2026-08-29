import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn({ name: 'offer_id', type: 'bigint' })
  offerId: string;

  @Column({ name: 'application_id', type: 'bigint', unique: true })
  applicationId: string;

  @Column({ name: 'offer_date', type: 'date', nullable: true })
  offerDate: string | null;

  @Column({ name: 'offer_status', type: 'varchar', length: 50, nullable: true })
  offerStatus: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Application, (application) => application.offer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application: Application;
}
