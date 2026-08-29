import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Source } from './entities/source.entity';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { QuerySourceDto } from './dto/query-source.dto';
import { paginate } from '../common/helpers/paginate';
import { PaginatedResult } from '../common/interceptors/transform.interceptor';

@Injectable()
export class SourcesService {
  constructor(
    @InjectRepository(Source)
    private readonly sourceRepository: Repository<Source>,
  ) {}

  async findAll(query: QuerySourceDto): Promise<PaginatedResult<Source>> {
    const { page = 1, limit = 20, search } = query;
    const qb = this.sourceRepository.createQueryBuilder('source');

    if (search) {
      qb.andWhere('source.sourceName LIKE :search', {
        search: `%${search}%`,
      });
    }

    qb.orderBy('source.sourceName', 'ASC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, page, limit);
  }

  async findOne(id: number): Promise<Source> {
    const source = await this.sourceRepository.findOne({
      where: { sourceId: id },
    });
    if (!source) {
      throw new NotFoundException(`Source with id "${id}" not found`);
    }
    return source;
  }

  async create(dto: CreateSourceDto): Promise<Source> {
    const existing = await this.sourceRepository.findOne({
      where: { sourceName: dto.sourceName },
    });
    if (existing) {
      throw new ConflictException(`Source "${dto.sourceName}" already exists`);
    }
    const source = this.sourceRepository.create(dto);
    return this.sourceRepository.save(source);
  }

  async update(id: number, dto: UpdateSourceDto): Promise<Source> {
    const source = await this.findOne(id);
    if (dto.sourceName !== undefined) {
      source.sourceName = dto.sourceName;
    }
    return this.sourceRepository.save(source);
  }

  async remove(id: number): Promise<void> {
    const source = await this.findOne(id);
    await this.sourceRepository.remove(source);
  }
}
