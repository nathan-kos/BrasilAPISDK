import { getStateCityByAcronym } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { describe, expect, it } from 'vitest';

describe('getStateCityByAcronym - integration', () => {
  it('should fetch cities for a given state acronym', async () => {
    const citys = await getStateCityByAcronym(Uf.SP);

    expect(Array.isArray(citys)).toBe(true);
    expect(citys.length).toBeGreaterThan(0);

    expect(citys[0]).toHaveProperty('name');
    expect(citys[0]).toHaveProperty('ibgeCode');
  });
});
