import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  RECRUITER = 'RECRUITER',
  CANDIDATE = 'CANDIDATE',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId!: number;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role!: UserRole;

  @Column({
    name: 'candidate_id',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  candidateId!: string | null;

  @Column({
    name: 'recruiter_id',
    type: 'int',
    nullable: true,
  })
  recruiterId!: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}