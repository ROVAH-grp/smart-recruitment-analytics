import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';

function createQueryBuilderMock(data: any[], total: number) {
  return {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([data, total]),
  } as any;
}

describe('ApplicationsService', () => {
  let applicationRepository: any;
  let candidateRepository: any;
  let jobRepository: any;
  let recruiterRepository: any;
  let sourceRepository: any;
  let service: ApplicationsService;

  beforeEach(() => {
    applicationRepository = {
      findOne: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) =>
        Promise.resolve({ ...entity, applicationId: '1' }),
      ),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    candidateRepository = { findOne: jest.fn() };
    jobRepository = { findOne: jest.fn() };
    recruiterRepository = { findOne: jest.fn() };
    sourceRepository = { findOne: jest.fn() };

    service = new ApplicationsService(
      applicationRepository,
      candidateRepository,
      jobRepository,
      recruiterRepository,
      sourceRepository,
    );
  });

  it('rejects creation when the referenced candidate does not exist', async () => {
    candidateRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({ candidateId: 'MISSING', jobId: 'J001' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects creation when the referenced job does not exist', async () => {
    candidateRepository.findOne.mockResolvedValue({ candidateId: 'C0001' });
    jobRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({ candidateId: 'C0001', jobId: 'MISSING' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates an application when all references are valid', async () => {
    candidateRepository.findOne.mockResolvedValue({ candidateId: 'C0001' });
    jobRepository.findOne.mockResolvedValue({ jobId: 'J001' });
    applicationRepository.findOne.mockResolvedValue({
      applicationId: '1',
      candidateId: 'C0001',
      jobId: 'J001',
    });

    const result = await service.create({
      candidateId: 'C0001',
      jobId: 'J001',
    });

    expect(result.applicationId).toBe('1');
  });

  it('throws not found for a missing application', async () => {
    applicationRepository.findOne.mockResolvedValue(null);
    await expect(service.findOne('999')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lists applications with pagination metadata', async () => {
    const qb = createQueryBuilderMock([{ applicationId: '1' }], 1);
    applicationRepository.createQueryBuilder.mockReturnValue(qb);

    const result = await service.findAll({ page: 1, limit: 20 } as any);

    expect(result.meta.total).toBe(1);
    expect(result.data).toHaveLength(1);
  });
});
