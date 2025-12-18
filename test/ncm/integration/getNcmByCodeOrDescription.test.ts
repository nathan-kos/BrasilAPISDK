import { getNcmByCodeOrDescription } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('get ncm by code or description - integration', () => {
  it('should get ncm by code or description piece successfully', async () => {
    const ncm = await getNcmByCodeOrDescription('choco');

    expect(ncm.length).toBeGreaterThan(0);
    expect(ncm[0]).toHaveProperty('code');
    expect(ncm[0]).toHaveProperty('description');
    expect(ncm[0]).toHaveProperty('startDate');
    expect(ncm[0]).toHaveProperty('endDate');
    expect(ncm[0]).toHaveProperty('actType');
    expect(ncm[0]).toHaveProperty('actNumber');
    expect(ncm[0]).toHaveProperty('actYear');
    expect(ncm[0].description.toLowerCase()).toContain('choco');
  });
});
