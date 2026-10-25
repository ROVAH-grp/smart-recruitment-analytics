import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoiningRecord } from './entities/joining-record.entity';
import { Application } from '../applications/entities/application.entity';
import { JoiningRecordsService } from './joining-records.service';
import { JoiningRecordsController } from './joining-records.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JoiningRecord, Application])],
  controllers: [JoiningRecordsController],
  providers: [JoiningRecordsService],
  exports: [JoiningRecordsService],
})
export class JoiningRecordsModule {}
