import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { Candidate } from '../candidates/entities/candidate.entity';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';
import { Application } from '../applications/entities/application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Resume,
      Candidate,
      Application,
    ]),
    CloudinaryModule,
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}