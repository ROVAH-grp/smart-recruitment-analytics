import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { Application } from '../applications/entities/application.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { QueryOfferDto } from './dto/query-offer.dto';
import { paginate } from '../common/helpers/paginate';
import { PaginatedResult } from '../common/interceptors/transform.interceptor';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async findAll(query: QueryOfferDto): Promise<PaginatedResult<Offer>> {
    const { page = 1, limit = 20, applicationId, offerStatus } = query;
    const qb = this.offerRepository.createQueryBuilder('offer');

    if (applicationId) {
      qb.andWhere('offer.applicationId = :applicationId', { applicationId });
    }
    if (offerStatus) {
      qb.andWhere('offer.offerStatus = :offerStatus', { offerStatus });
    }

    qb.orderBy('offer.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, page, limit);
  }

  async findOne(id: string): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { offerId: id },
    });
    if (!offer) {
      throw new NotFoundException(`Offer with id "${id}" not found`);
    }
    return offer;
  }

  async create(dto: CreateOfferDto): Promise<Offer> {
    const application = await this.applicationRepository.findOne({
      where: { applicationId: dto.applicationId },
    });
    if (!application) {
      throw new BadRequestException(
        `Application with id "${dto.applicationId}" does not exist`,
      );
    }

    const existing = await this.offerRepository.findOne({
      where: { applicationId: dto.applicationId },
    });
    if (existing) {
      throw new ConflictException(
        `An offer already exists for application "${dto.applicationId}"`,
      );
    }

    const offer = this.offerRepository.create({
      applicationId: dto.applicationId,
      offerDate: dto.offerDate ?? null,
      offerStatus: dto.offerStatus ?? null,
    });

    return this.offerRepository.save(offer);
  }

  async update(id: string, dto: UpdateOfferDto): Promise<Offer> {
    const offer = await this.findOne(id);

    if (dto.offerDate !== undefined) offer.offerDate = dto.offerDate;
    if (dto.offerStatus !== undefined) offer.offerStatus = dto.offerStatus;

    return this.offerRepository.save(offer);
  }

  async remove(id: string): Promise<void> {
    const offer = await this.findOne(id);
    await this.offerRepository.remove(offer);
  }
}
