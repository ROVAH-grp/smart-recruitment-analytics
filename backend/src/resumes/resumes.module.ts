import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { Candidate } from '../candidates/entities/candidate.entity';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';

@Module({
  imports: [
    // Candidate is registered here too so ResumesService can inject its
    // repository for existence checks, WITHOUT importing/modifying the
    // existing CandidatesModule.
    TypeOrmModule.forFeature([Resume, Candidate]),
    CloudinaryModule,
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
