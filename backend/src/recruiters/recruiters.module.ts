import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruiter } from './entities/recruiter.entity';
import { RecruitersService } from './recruiters.service';
import { RecruitersController } from './recruiters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Recruiter])],
  controllers: [RecruitersController],
  providers: [RecruitersService],
  exports: [RecruitersService],
})
export class RecruitersModule {}
