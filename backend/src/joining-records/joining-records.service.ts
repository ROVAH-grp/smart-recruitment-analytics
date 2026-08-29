import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JoiningRecord } from './entities/joining-record.entity';
import { Application } from '../applications/entities/application.entity';
import { CreateJoiningRecordDto } from './dto/create-joining-record.dto';
import { UpdateJoiningRecordDto } from './dto/update-joining-record.dto';
import { QueryJoiningRecordDto } from './dto/query-joining-record.dto';
import { paginate } from '../common/helpers/paginate';
import { PaginatedResult } from '../common/interceptors/transform.interceptor';

@Injectable()
export class JoiningRecordsService {
  constructor(
    @InjectRepository(JoiningRecord)
    private readonly joiningRecordRepository: Repository<JoiningRecord>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async findAll(
    query: QueryJoiningRecordDto,
  ): Promise<PaginatedResult<JoiningRecord>> {
    const { page = 1, limit = 20, applicationId, joiningStatus } = query;
    const qb = this.joiningRecordRepository.createQueryBuilder('joiningRecord');

    if (applicationId) {
      qb.andWhere('joiningRecord.applicationId = :applicationId', {
        applicationId,
      });
    }
    if (joiningStatus) {
      qb.andWhere('joiningRecord.joiningStatus = :joiningStatus', {
        joiningStatus,
      });
    }

    qb.orderBy('joiningRecord.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, page, limit);
  }

  async findOne(id: string): Promise<JoiningRecord> {
    const record = await this.joiningRecordRepository.findOne({
      where: { joiningId: id },
    });
    if (!record) {
      throw new NotFoundException(`Joining record with id "${id}" not found`);
    }
    return record;
  }

  async create(dto: CreateJoiningRecordDto): Promise<JoiningRecord> {
    const application = await this.applicationRepository.findOne({
      where: { applicationId: dto.applicationId },
    });
    if (!application) {
      throw new BadRequestException(
        `Application with id "${dto.applicationId}" does not exist`,
      );
    }

    const existing = await this.joiningRecordRepository.findOne({
      where: { applicationId: dto.applicationId },
    });
    if (existing) {
      throw new ConflictException(
        `A joining record already exists for application "${dto.applicationId}"`,
      );
    }

    const record = this.joiningRecordRepository.create({
      applicationId: dto.applicationId,
      joiningDate: dto.joiningDate ?? null,
      joiningStatus: dto.joiningStatus ?? null,
    });

    return this.joiningRecordRepository.save(record);
  }

  async update(
    id: string,
    dto: UpdateJoiningRecordDto,
  ): Promise<JoiningRecord> {
    const record = await this.findOne(id);

    if (dto.joiningDate !== undefined) record.joiningDate = dto.joiningDate;
    if (dto.joiningStatus !== undefined)
      record.joiningStatus = dto.joiningStatus;

    return this.joiningRecordRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.joiningRecordRepository.remove(record);
  }
}
