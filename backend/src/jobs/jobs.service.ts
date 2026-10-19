import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobDto } from './dto/query-job.dto';
import { paginate } from '../common/helpers/paginate';
import { PaginatedResult } from '../common/interceptors/transform.interceptor';

const SORTABLE_FIELDS = ['jobTitle', 'department', 'jobPostedDate', 'createdAt'];

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async findAll(query: QueryJobDto): Promise<PaginatedResult<Job>> {
    const {
      page = 1,
      limit = 20,
      search,
      department,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const qb = this.jobRepository.createQueryBuilder('job');

    if (search) {
      qb.andWhere('(job.jobTitle LIKE :search OR job.jobId LIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (department) {
      qb.andWhere('job.department LIKE :department', {
        department: `%${department}%`,
      });
    }

    const sortField = SORTABLE_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    qb.orderBy(`job.${sortField}`, sortOrder === 'ASC' ? 'ASC' : 'DESC');

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, page, limit);
  }

  async findOne(jobId: string): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { jobId } });
    if (!job) {
      throw new NotFoundException(`Job with id "${jobId}" not found`);
    }
    return job;
  }

  async create(dto: CreateJobDto): Promise<Job> {
    const existing = await this.jobRepository.findOne({
      where: { jobId: dto.jobId },
    });
    if (existing) {
      throw new ConflictException(`Job with id "${dto.jobId}" already exists`);
    }

   const job = this.jobRepository.create({
  jobId: dto.jobId,
  jobTitle: dto.jobTitle,
  department: dto.department ?? null,
  jobPostedDate: dto.jobPostedDate ?? null,
  requiredSkills: dto.requiredSkills ?? null,
  requiredExperienceYears: dto.requiredExperienceYears ?? null,
  requiredEducation: dto.requiredEducation ?? null,
  requiredCertifications: dto.requiredCertifications ?? null,
  preferredProjectsKeywords: dto.preferredProjectsKeywords ?? null,
});
    return this.jobRepository.save(job);
  }

  async update(jobId: string, dto: UpdateJobDto): Promise<Job> {
  const job = await this.findOne(jobId);

  if (dto.jobTitle !== undefined) {
    job.jobTitle = dto.jobTitle;
  }

  if (dto.department !== undefined) {
    job.department = dto.department;
  }

  if (dto.jobPostedDate !== undefined) {
    job.jobPostedDate = dto.jobPostedDate;
  }

  if (dto.requiredSkills !== undefined) {
    job.requiredSkills = dto.requiredSkills;
  }

  if (dto.requiredExperienceYears !== undefined) {
    job.requiredExperienceYears = dto.requiredExperienceYears;
  }

  if (dto.requiredEducation !== undefined) {
    job.requiredEducation = dto.requiredEducation;
  }

  if (dto.requiredCertifications !== undefined) {
    job.requiredCertifications = dto.requiredCertifications;
  }

  if (dto.preferredProjectsKeywords !== undefined) {
    job.preferredProjectsKeywords = dto.preferredProjectsKeywords;
  }

  return this.jobRepository.save(job);
}

  async remove(jobId: string): Promise<void> {
    const job = await this.findOne(jobId);
    await this.jobRepository.remove(job);
  }
}
