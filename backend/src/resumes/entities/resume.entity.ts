import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * One resume per candidate. Deliberately has NO TypeORM relation decorator
 * back to Candidate — the existing Candidate entity/module is not modified
 * by this feature. The link is candidate_id (enforced at the DB level by a
 * FOREIGN KEY in resume_schema.sql) plus explicit lookups in the service.
 *
 * The actual file lives in Cloudinary; only metadata + URL are stored here.
 */
@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn({ name: 'resume_id', type: 'bigint' })
  resumeId: string;

  @Column({ name: 'candidate_id', type: 'varchar', length: 50, unique: true })
  candidateId: string;

  @Column({ name: 'original_filename', type: 'varchar', length: 255 })
  originalFilename: string;

  @Column({ name: 'cloudinary_public_id', type: 'varchar', length: 255 })
  cloudinaryPublicId: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ name: 'file_size', type: 'int' })
  fileSize: number;

  @Column({ name: 'cloudinary_url', type: 'varchar', length: 500 })
  cloudinaryUrl: string;

  @CreateDateColumn({ name: 'uploaded_at', type: 'timestamp' })
  uploadedAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
