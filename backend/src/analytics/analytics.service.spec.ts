import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let dataSource: any;
  let service: AnalyticsService;

  beforeEach(() => {
    dataSource = { query: jest.fn() };
    service = new AnalyticsService(dataSource);
  });

  it('computes dashboard KPIs from the aggregate query result', async () => {
    dataSource.query.mockResolvedValue([
      {
        totalApplicants: 1000,
        totalJoined: 102,
        averageInterviewScore: 74.68,
        averageTimeToHire: 35.2,
        averageTimeToFill: 40.1,
        totalOffers: 189,
        acceptedOffers: 102,
      },
    ]);

    const result = await service.getDashboard({});

    expect(result.totalApplicants).toBe(1000);
    expect(result.totalJoined).toBe(102);
    expect(result.hiringSuccessRate).toBeCloseTo(10.2, 1);
    expect(result.offerAcceptanceRate).toBeCloseTo(53.97, 1);
    expect(result.averageInterviewScore).toBe(74.68);
  });

  it('returns zero rates instead of dividing by zero when there is no data', async () => {
    dataSource.query.mockResolvedValue([
      {
        totalApplicants: 0,
        totalJoined: 0,
        averageInterviewScore: null,
        averageTimeToHire: null,
        averageTimeToFill: null,
        totalOffers: 0,
        acceptedOffers: 0,
      },
    ]);

    const result = await service.getDashboard({});

    expect(result.hiringSuccessRate).toBe(0);
    expect(result.offerAcceptanceRate).toBe(0);
    expect(result.averageInterviewScore).toBe(0);
  });

  it('computes funnel stage conversion rates relative to applied count', async () => {
    dataSource.query.mockResolvedValue([
      {
        applied: 1000,
        screened: 807,
        shortlisted: 657,
        interviewed: 495,
        selected: 330,
        offered: 189,
        joined: 102,
      },
    ]);

    const result = await service.getFunnel({});

    expect(result.stages).toHaveLength(7);
    expect(result.stages[0]).toEqual({
      stage: 'Applied',
      candidates: 1000,
      conversionRate: 100,
    });
    expect(result.stages[6]).toEqual({
      stage: 'Joined',
      candidates: 102,
      conversionRate: 10.2,
    });
  });
});
