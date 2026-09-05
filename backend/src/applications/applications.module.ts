import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Candidate } from '../candidates/entities/candidate.entity';
import { Job } from '../jobs/entities/job.entity';
import { Recruiter } from '../recruiters/entities/recruiter.entity';
import { Source } from '../sources/entities/source.entity';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { ResumeAnalysis } from './entities/resume-analysis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
  Application,
  ResumeAnalysis,
  Candidate,
  Job,
  Recruiter,
  Source,
]),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
