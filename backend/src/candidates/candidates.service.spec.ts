import { ConflictException, NotFoundException } from '@nestjs/common';
import { CandidatesService } from './candidates.service';

function createQueryBuilderMock(data: any[], total: number) {
  const qb: any = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([data, total]),
  };
  return qb;
}

describe('CandidatesService', () => {
  let repository: any;
  let service: CandidatesService;

  beforeEach(() => {
    repository = {
      findOne: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => Promise.resolve(entity)),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    service = new CandidatesService(repository);
  });

  it('creates a candidate when the id is not already taken', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await service.create({
      candidateId: 'C0001',
      candidateName: 'Rahul Sharma',
      experienceYears: 4.5,
      education: 'B.Tech',
    });

    expect(result.candidateId).toBe('C0001');
    expect(repository.save).toHaveBeenCalled();
  });

  it('throws a conflict error when the candidate id already exists', async () => {
    repository.findOne.mockResolvedValue({ candidateId: 'C0001' });

    await expect(
      service.create({
        candidateId: 'C0001',
        candidateName: 'Rahul Sharma',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws not found when the candidate does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne('MISSING')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('paginates results using the query builder', async () => {
    const qb = createQueryBuilderMock(
      [{ candidateId: 'C0001', candidateName: 'Rahul' }],
      1,
    );
    repository.createQueryBuilder.mockReturnValue(qb);

    const result = await service.findAll({ page: 1, limit: 20 } as any);

    expect(result.meta).toEqual({
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    });
    expect(result.data).toHaveLength(1);
  });
});
