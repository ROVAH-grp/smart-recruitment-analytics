import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './entities/interview.entity';
import { Application } from '../applications/entities/application.entity';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { QueryInterviewDto } from './dto/query-interview.dto';
import { paginate } from '../common/helpers/paginate';
import { PaginatedResult } from '../common/interceptors/transform.interceptor';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async findAll(
  query: QueryInterviewDto,
  candidateId?: string,
): Promise<PaginatedResult<Interview>> {
  const { page = 1, limit = 20, applicationId, minScore } = query;

  const qb = this.interviewRepository.createQueryBuilder('interview');

  if (applicationId) {
    qb.andWhere('interview.applicationId = :applicationId', {
      applicationId,
    });
  }

  if (minScore !== undefined) {
    qb.andWhere('interview.overallScore >= :minScore', {
      minScore,
    });
  }

  // Candidate can only see interviews belonging to their own applications.
  if (candidateId) {
    const applications = await this.applicationRepository.find({
      where: { candidateId },
      select: ['applicationId'],
    });

    const applicationIds = applications.map(
      (application) => application.applicationId,
    );

    if (applicationIds.length === 0) {
      return paginate([], 0, page, limit);
    }

    qb.andWhere('interview.applicationId IN (:...applicationIds)', {
      applicationIds,
    });
  }

  qb.orderBy('interview.createdAt', 'DESC');
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();

  return paginate(data, total, page, limit);
}

  async findOne(
  id: string,
  candidateId?: string,
): Promise<Interview> {
  const interview = await this.interviewRepository.findOne({
    where: { interviewId: id },
  });

  if (!interview) {
    throw new NotFoundException(
      `Interview with id "${id}" not found`,
    );
  }

  // Candidate can only access an interview linked to their own application.
  if (candidateId) {
    const application = await this.applicationRepository.findOne({
      where: {
        applicationId: interview.applicationId,
        candidateId,
      },
    });

    if (!application) {
      throw new ForbiddenException(
        'You can only access your own interviews',
      );
    }
  }

  return interview;
}

  async create(dto: CreateInterviewDto): Promise<Interview> {
    const application = await this.applicationRepository.findOne({
      where: { applicationId: dto.applicationId },
    });
    if (!application) {
      throw new BadRequestException(
        `Application with id "${dto.applicationId}" does not exist`,
      );
    }

    const existing = await this.interviewRepository.findOne({
      where: { applicationId: dto.applicationId },
    });
    if (existing) {
      throw new ConflictException(
        `An interview already exists for application "${dto.applicationId}"`,
      );
    }

    const interview = this.interviewRepository.create({
      applicationId: dto.applicationId,
      interviewDate: dto.interviewDate ?? null,
      technicalScore:
        dto.technicalScore !== undefined ? String(dto.technicalScore) : null,
      communicationScore:
        dto.communicationScore !== undefined
          ? String(dto.communicationScore)
          : null,
      problemSolvingScore:
        dto.problemSolvingScore !== undefined
          ? String(dto.problemSolvingScore)
          : null,
      overallScore:
        dto.overallScore !== undefined ? String(dto.overallScore) : null,
    });

    return this.interviewRepository.save(interview);
  }

  async update(id: string, dto: UpdateInterviewDto): Promise<Interview> {
    const interview = await this.findOne(id);

    if (dto.interviewDate !== undefined)
      interview.interviewDate = dto.interviewDate;
    if (dto.technicalScore !== undefined)
      interview.technicalScore = String(dto.technicalScore);
    if (dto.communicationScore !== undefined)
      interview.communicationScore = String(dto.communicationScore);
    if (dto.problemSolvingScore !== undefined)
      interview.problemSolvingScore = String(dto.problemSolvingScore);
    if (dto.overallScore !== undefined)
      interview.overallScore = String(dto.overallScore);

    return this.interviewRepository.save(interview);
  }

  async remove(id: string): Promise<void> {
    const interview = await this.findOne(id);
    await this.interviewRepository.remove(interview);
  }
}
