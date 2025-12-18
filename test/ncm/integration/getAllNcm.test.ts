import { getAllNcm } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('get all ncm - integration', () => {
  it('should get all ncm successfully', async () => {
    const ncm = await getAllNcm();

    expect(ncm.length).toBeGreaterThan(0);
    expect(ncm[0]).toHaveProperty('code');
    expect(ncm[0]).toHaveProperty('description');
    expect(ncm[0]).toHaveProperty('startDate');
    expect(ncm[0]).toHaveProperty('endDate');
    expect(ncm[0]).toHaveProperty('actType');
    expect(ncm[0]).toHaveProperty('actNumber');
    expect(ncm[0]).toHaveProperty('actYear');
  });
});
