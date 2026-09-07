import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';
import { Resume } from './entities/resume.entity';

import { Candidate } from '../candidates/entities/candidate.entity';
import { Application } from '../applications/entities/application.entity';

import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';
import { AiService } from '../ai/ai.service';
import { ResumeAnalysis } from '../applications/entities/resume-analysis.entity';
import { Job } from '../jobs/entities/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
  Resume,
  Candidate,
  Application,
  ResumeAnalysis,
  Job,
]),
    CloudinaryModule,
  ],
  controllers: [ResumesController],
  providers: [
    ResumesService,
    AiService,
  ],
})
export class ResumesModule {}