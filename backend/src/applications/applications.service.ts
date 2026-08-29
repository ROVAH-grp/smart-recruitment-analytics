import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { Candidate } from '../candidates/entities/candidate.entity';
import { Job } from '../jobs/entities/job.entity';
import { Recruiter } from '../recruiters/entities/recruiter.entity';
import { Source } from '../sources/entities/source.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { paginate } from '../common/helpers/paginate';
import { PaginatedResult } from '../common/interceptors/transform.interceptor';

const SORTABLE_FIELDS = ['applicationDate', 'matchScore', 'createdAt'];

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
    @InjectRepository(Source)
    private readonly sourceRepository: Repository<Source>,
  ) {}

  async findAll(
    query: QueryApplicationDto,
  ): Promise<PaginatedResult<Application>> {
    const {
      page = 1,
      limit = 20,
      status,
      candidateId,
      jobId,
      recruiterId,
      sourceId,
      department,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const qb = this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.candidate', 'candidate')
      .leftJoinAndSelect('application.job', 'job')
      .leftJoinAndSelect('application.recruiter', 'recruiter')
      .leftJoinAndSelect('application.source', 'source');

    if (status) {
      qb.andWhere('application.status = :status', { status });
    }
    if (candidateId) {
      qb.andWhere('application.candidateId = :candidateId', { candidateId });
    }
    if (jobId) {
      qb.andWhere('application.jobId = :jobId', { jobId });
    }
    if (recruiterId !== undefined) {
      qb.andWhere('application.recruiterId = :recruiterId', { recruiterId });
    }
    if (sourceId !== undefined) {
      qb.andWhere('application.sourceId = :sourceId', { sourceId });
    }
    if (department) {
      qb.andWhere('job.department LIKE :department', {
        department: `%${department}%`,
      });
    }
    if (startDate) {
      qb.andWhere('application.applicationDate >= :startDate', { startDate });
    }
    if (endDate) {
      qb.andWhere('application.applicationDate <= :endDate', { endDate });
    }

    const sortField = SORTABLE_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    qb.orderBy(`application.${sortField}`, sortOrder === 'ASC' ? 'ASC' : 'DESC');

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, page, limit);
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { applicationId: id },
      relations: [
        'candidate',
        'job',
        'recruiter',
        'source',
        'interview',
        'offer',
        'joiningRecord',
      ],
    });
    if (!application) {
      throw new NotFoundException(`Application with id "${id}" not found`);
    }
    return application;
  }

  private async validateReferences(dto: {
    candidateId?: string;
    jobId?: string;
    recruiterId?: number;
    sourceId?: number;
  }): Promise<void> {
    if (dto.candidateId) {
      const candidate = await this.candidateRepository.findOne({
        where: { candidateId: dto.candidateId },
      });
      if (!candidate) {
        throw new BadRequestException(
          `Candidate with id "${dto.candidateId}" does not exist`,
        );
      }
    }
    if (dto.jobId) {
      const job = await this.jobRepository.findOne({
        where: { jobId: dto.jobId },
      });
      if (!job) {
        throw new BadRequestException(
          `Job with id "${dto.jobId}" does not exist`,
        );
      }
    }
    if (dto.recruiterId !== undefined) {
      const recruiter = await this.recruiterRepository.findOne({
        where: { recruiterId: dto.recruiterId },
      });
      if (!recruiter) {
        throw new BadRequestException(
          `Recruiter with id "${dto.recruiterId}" does not exist`,
        );
      }
    }
    if (dto.sourceId !== undefined) {
      const source = await this.sourceRepository.findOne({
        where: { sourceId: dto.sourceId },
      });
      if (!source) {
        throw new BadRequestException(
          `Source with id "${dto.sourceId}" does not exist`,
        );
      }
    }
  }

  async create(dto: CreateApplicationDto): Promise<Application> {
    await this.validateReferences(dto);

    const application = this.applicationRepository.create({
      candidateId: dto.candidateId,
      jobId: dto.jobId,
      recruiterId: dto.recruiterId ?? null,
      sourceId: dto.sourceId ?? null,
      applicationDate: dto.applicationDate ?? null,
      screeningDate: dto.screeningDate ?? null,
      shortlistDate: dto.shortlistDate ?? null,
      interviewDate: dto.interviewDate ?? null,
      selectionDate: dto.selectionDate ?? null,
      offerDate: dto.offerDate ?? null,
      joiningDate: dto.joiningDate ?? null,
      status: dto.status ?? null,
      matchScore: dto.matchScore !== undefined ? String(dto.matchScore) : null,
      recruitmentCost:
        dto.recruitmentCost !== undefined ? String(dto.recruitmentCost) : null,
    });

    const saved = await this.applicationRepository.save(application);
    return this.findOne(saved.applicationId);
  }

  async update(id: string, dto: UpdateApplicationDto): Promise<Application> {
    const application = await this.findOne(id);
    await this.validateReferences(dto);

    if (dto.candidateId !== undefined) application.candidateId = dto.candidateId;
    if (dto.jobId !== undefined) application.jobId = dto.jobId;
    if (dto.recruiterId !== undefined) application.recruiterId = dto.recruiterId;
    if (dto.sourceId !== undefined) application.sourceId = dto.sourceId;
    if (dto.applicationDate !== undefined)
      application.applicationDate = dto.applicationDate;
    if (dto.screeningDate !== undefined)
      application.screeningDate = dto.screeningDate;
    if (dto.shortlistDate !== undefined)
      application.shortlistDate = dto.shortlistDate;
    if (dto.interviewDate !== undefined)
      application.interviewDate = dto.interviewDate;
    if (dto.selectionDate !== undefined)
      application.selectionDate = dto.selectionDate;
    if (dto.offerDate !== undefined) application.offerDate = dto.offerDate;
    if (dto.joiningDate !== undefined) application.joiningDate = dto.joiningDate;
    if (dto.status !== undefined) application.status = dto.status;
    if (dto.matchScore !== undefined)
      application.matchScore = String(dto.matchScore);
    if (dto.recruitmentCost !== undefined)
      application.recruitmentCost = String(dto.recruitmentCost);

    await this.applicationRepository.save(application);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const application = await this.findOne(id);
    await this.applicationRepository.remove(application);
  }
}
