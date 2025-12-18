import { getNcmByCode } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('get ncm by code - integration', () => {
  it('should get ncm by code successfully', async () => {
    const ncm = await getNcmByCode('1806.32.10');

    expect(ncm).toHaveProperty('code', '1806.32.10');
    expect(ncm).toHaveProperty('description', 'Chocolate');
    expect(ncm).toHaveProperty('startDate');
    expect(ncm.startDate).toBeInstanceOf(Date);
    expect(ncm.endDate).toBeInstanceOf(Date);
    expect(ncm).toHaveProperty('actType', 'Res Camex');
    expect(ncm).toHaveProperty('actNumber', '272');
    expect(ncm).toHaveProperty('actYear', '2021');
  });
});
