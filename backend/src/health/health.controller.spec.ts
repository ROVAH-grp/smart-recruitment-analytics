import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('reports database as connected when the query succeeds', async () => {
    const dataSource = { query: jest.fn().mockResolvedValue([{ 1: 1 }]) } as any;
    const controller = new HealthController(dataSource);

    const result = await controller.check();

    expect(result).toEqual({ status: 'ok', database: 'connected' });
    expect(dataSource.query).toHaveBeenCalledWith('SELECT 1');
  });

  it('reports database as disconnected when the query throws', async () => {
    const dataSource = {
      query: jest.fn().mockRejectedValue(new Error('connection refused')),
    } as any;
    const controller = new HealthController(dataSource);

    const result = await controller.check();

    expect(result).toEqual({ status: 'ok', database: 'disconnected' });
  });
});
