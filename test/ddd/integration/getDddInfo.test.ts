import { getDddInfo } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { describe, expect, it } from 'vitest';

describe('getDddInfo - integration', () => {
  it('should return Ddd info', async () => {
    const dddInfo = await getDddInfo(11);

    expect(dddInfo).toHaveProperty('state', Uf.SP);
    expect(dddInfo).toHaveProperty('cities');
    expect(Array.isArray(dddInfo.cities)).toBe(true);
  });

  it('should throw bad request if ddd is invalid', async () => {
    await expect(getDddInfo(111)).rejects.toThrow('DDD deve conter apenas 2 dígitos');
  });

  it('should throw not found error if ddd does not exist', async () => {
    await expect(getDddInfo(25)).rejects.toThrow('DDD não encontrado');
  });
});
