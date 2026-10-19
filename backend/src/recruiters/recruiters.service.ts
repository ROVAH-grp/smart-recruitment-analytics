import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recruiter } from './entities/recruiter.entity';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { QueryRecruiterDto } from './dto/query-recruiter.dto';
import { paginate } from '../common/helpers/paginate';
import { PaginatedResult } from '../common/interceptors/transform.interceptor';

@Injectable()
export class RecruitersService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
  ) {}

  async findAll(query: QueryRecruiterDto): Promise<PaginatedResult<Recruiter>> {
    const { page = 1, limit = 20, search } = query;
    const qb = this.recruiterRepository.createQueryBuilder('recruiter');

    if (search) {
      qb.andWhere('recruiter.recruiterName LIKE :search', {
        search: `%${search}%`,
      });
    }

    qb.orderBy('recruiter.recruiterName', 'ASC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, page, limit);
  }

  async findOne(id: number): Promise<Recruiter> {
    const recruiter = await this.recruiterRepository.findOne({
      where: { recruiterId: id },
    });
    if (!recruiter) {
      throw new NotFoundException(`Recruiter with id "${id}" not found`);
    }
    return recruiter;
  }

  async create(dto: CreateRecruiterDto): Promise<Recruiter> {
    const existing = await this.recruiterRepository.findOne({
      where: { recruiterName: dto.recruiterName },
    });
    if (existing) {
      throw new ConflictException(
        `Recruiter "${dto.recruiterName}" already exists`,
      );
    }
    const recruiter = this.recruiterRepository.create(dto);
    return this.recruiterRepository.save(recruiter);
  }

  async update(id: number, dto: UpdateRecruiterDto): Promise<Recruiter> {
    const recruiter = await this.findOne(id);
    if (dto.recruiterName !== undefined) {
      recruiter.recruiterName = dto.recruiterName;
    }
    return this.recruiterRepository.save(recruiter);
  }

  async remove(id: number): Promise<void> {
    const recruiter = await this.findOne(id);
    await this.recruiterRepository.remove(recruiter);
  }
}
