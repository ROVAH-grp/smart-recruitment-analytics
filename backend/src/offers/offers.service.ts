import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserRole } from '../auth/entities/user.entity';
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

 async findAll(
  query: QueryOfferDto,
  user: any,
): Promise<PaginatedResult<Offer>> {
  const {
    page = 1,
    limit = 20,
    applicationId,
    offerStatus,
  } = query;

  const qb = this.offerRepository.createQueryBuilder('offer');

  // Candidates can only see offers for their own applications
  if (user?.role === UserRole.CANDIDATE) {
    if (!user.candidateId) {
      throw new ForbiddenException(
        'Candidate account is not linked to a candidate',
      );
    }

    const applications = await this.applicationRepository.find({
      where: {
        candidateId: user.candidateId,
      },
    });

    const applicationIds = applications.map(
      (application) => application.applicationId,
    );

    // Candidate has no applications, therefore no offers
    if (applicationIds.length === 0) {
      return paginate([], 0, page, limit);
    }

    qb.andWhere(
      'offer.applicationId IN (:...applicationIds)',
      { applicationIds },
    );
  }

  if (applicationId) {
    qb.andWhere(
      'offer.applicationId = :applicationId',
      { applicationId },
    );
  }

  if (offerStatus) {
    qb.andWhere(
      'offer.offerStatus = :offerStatus',
      { offerStatus },
    );
  }

  qb.orderBy('offer.createdAt', 'DESC');
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();

  return paginate(data, total, page, limit);
}

  async findOne(id: string, user: any): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { offerId: id },
    });
    if (!offer) {
      throw new NotFoundException(`Offer with id "${id}" not found`);
    }

    if (user?.role === UserRole.CANDIDATE) {
  if (!user.candidateId) {
    throw new ForbiddenException('Candidate account is not linked to a candidate');
  }

  const application = await this.applicationRepository.findOne({
    where: {
      applicationId: offer.applicationId,
    },
  });

  if (!application || application.candidateId !== user.candidateId) {
    throw new ForbiddenException('You are not allowed to view this offer');
  }
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
    const offer = await this.findOne(id, null);

    if (dto.offerDate !== undefined) offer.offerDate = dto.offerDate;
    if (dto.offerStatus !== undefined) offer.offerStatus = dto.offerStatus;

    return this.offerRepository.save(offer);
  }

  async remove(id: string): Promise<void> {
   const offer = await this.findOne(id, null);
    await this.offerRepository.remove(offer);
  }
}
