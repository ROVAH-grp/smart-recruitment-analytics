import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { QueryCandidateDto } from './dto/query-candidate.dto';
import { paginate } from '../common/helpers/paginate';
import { PaginatedResult } from '../common/interceptors/transform.interceptor';

const SORTABLE_FIELDS = ['candidateName', 'experienceYears', 'createdAt'];

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async findAll(
    query: QueryCandidateDto,
  ): Promise<PaginatedResult<Candidate>> {
    const {
      page = 1,
      limit = 20,
      search,
      education,
      minExperience,
      maxExperience,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const qb = this.candidateRepository.createQueryBuilder('candidate');

    if (search) {
      qb.andWhere(
        '(candidate.candidateName LIKE :search OR candidate.candidateId LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (education) {
      qb.andWhere('candidate.education LIKE :education', {
        education: `%${education}%`,
      });
    }

    if (minExperience !== undefined) {
      qb.andWhere('candidate.experienceYears >= :minExperience', {
        minExperience,
      });
    }

    if (maxExperience !== undefined) {
      qb.andWhere('candidate.experienceYears <= :maxExperience', {
        maxExperience,
      });
    }

    const sortField = SORTABLE_FIELDS.includes(sortBy)
      ? sortBy
      : 'createdAt';
    qb.orderBy(
      `candidate.${sortField}`,
      sortOrder === 'ASC' ? 'ASC' : 'DESC',
    );

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, page, limit);
  }

  async findOne(candidateId: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOne({
      where: { candidateId },
    });
    if (!candidate) {
      throw new NotFoundException(
        `Candidate with id "${candidateId}" not found`,
      );
    }
    return candidate;
  }

  async create(dto: CreateCandidateDto): Promise<Candidate> {
    const existing = await this.candidateRepository.findOne({
      where: { candidateId: dto.candidateId },
    });
    if (existing) {
      throw new ConflictException(
        `Candidate with id "${dto.candidateId}" already exists`,
      );
    }

    const candidate = this.candidateRepository.create({
      candidateId: dto.candidateId,
      candidateName: dto.candidateName,
      experienceYears:
        dto.experienceYears !== undefined
          ? String(dto.experienceYears)
          : null,
      education: dto.education ?? null,
    });
    return this.candidateRepository.save(candidate);
  }

  async update(
    candidateId: string,
    dto: UpdateCandidateDto,
  ): Promise<Candidate> {
    const candidate = await this.findOne(candidateId);

    if (dto.candidateName !== undefined) {
      candidate.candidateName = dto.candidateName;
    }
    if (dto.experienceYears !== undefined) {
      candidate.experienceYears = String(dto.experienceYears);
    }
    if (dto.education !== undefined) {
      candidate.education = dto.education;
    }

    return this.candidateRepository.save(candidate);
  }

  async remove(candidateId: string): Promise<void> {
    const candidate = await this.findOne(candidateId);
    await this.candidateRepository.remove(candidate);
  }
}
