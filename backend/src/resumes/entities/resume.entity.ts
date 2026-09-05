import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Application } from '../../applications/entities/application.entity';

@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn({ name: 'resume_id', type: 'bigint' })
  resumeId!: string;

  @Column({
    name: 'candidate_id',
    type: 'varchar',
    length: 50,
  })
  candidateId!: string;

  @Column({
    name: 'application_id',
    type: 'bigint',
    nullable: true,
    unique: true,
  })
  applicationId!: string | null;

  @Column({
    name: 'original_filename',
    type: 'varchar',
    length: 255,
  })
  originalFilename!: string;

  @Column({
    name: 'cloudinary_public_id',
    type: 'varchar',
    length: 255,
  })
  cloudinaryPublicId!: string;

  @Column({
    name: 'mime_type',
    type: 'varchar',
    length: 100,
  })
  mimeType!: string;

  @Column({
    name: 'file_size',
    type: 'int',
  })
  fileSize!: number;

  @Column({
    name: 'cloudinary_url',
    type: 'varchar',
    length: 500,
  })
  cloudinaryUrl!: string;

  @CreateDateColumn({
    name: 'uploaded_at',
    type: 'timestamp',
  })
  uploadedAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt!: Date;

  @ManyToOne(() => Application, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application!: Application | null;
}