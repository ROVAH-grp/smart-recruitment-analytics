import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { CandidatesModule } from './candidates/candidates.module';
import { JobsModule } from './jobs/jobs.module';
import { RecruitersModule } from './recruiters/recruiters.module';
import { SourcesModule } from './sources/sources.module';
import { ApplicationsModule } from './applications/applications.module';
import { InterviewsModule } from './interviews/interviews.module';
import { OffersModule } from './offers/offers.module';
import { JoiningRecordsModule } from './joining-records/joining-records.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ResumesModule } from './resumes/resumes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    DatabaseModule,
    HealthModule,
    CandidatesModule,
    JobsModule,
    RecruitersModule,
    SourcesModule,
    ApplicationsModule,
    InterviewsModule,
    OffersModule,
    JoiningRecordsModule,
    AnalyticsModule,
    ResumesModule,
  ],
})
export class AppModule {}
