import { ConflictException, NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';

function createQueryBuilderMock(data: any[], total: number) {
  return {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([data, total]),
  } as any;
}

describe('JobsService', () => {
  let repository: any;
  let service: JobsService;

  beforeEach(() => {
    repository = {
      findOne: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => Promise.resolve(entity)),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    service = new JobsService(repository);
  });

  it('creates a job when the id is not already taken', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await service.create({
      jobId: 'J001',
      jobTitle: 'Backend Engineer',
      department: 'AI & ML',
    });

    expect(result.jobId).toBe('J001');
  });

  it('throws a conflict error when the job id already exists', async () => {
    repository.findOne.mockResolvedValue({ jobId: 'J001' });

    await expect(
      service.create({ jobId: 'J001', jobTitle: 'Backend Engineer' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws not found for a missing job', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.findOne('MISSING')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lists jobs with pagination metadata', async () => {
    const qb = createQueryBuilderMock([{ jobId: 'J001' }], 1);
    repository.createQueryBuilder.mockReturnValue(qb);

    const result = await service.findAll({ page: 1, limit: 20 } as any);

    expect(result.meta.total).toBe(1);
    expect(result.data).toHaveLength(1);
  });
});
