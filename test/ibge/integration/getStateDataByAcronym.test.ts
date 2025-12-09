import { getStateDataByAcronym } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { describe, expect, it } from 'vitest';

describe('get state data by acronym - integration', () => {
  it('should return state data for a given acronym', async () => {
    const state = await getStateDataByAcronym(Uf.SP);

    expect(state).toHaveProperty('id', 35);
    expect(state).toHaveProperty('acronym', Uf.SP);
    expect(state).toHaveProperty('name', 'São Paulo');
    expect(state).toHaveProperty('region');
    expect(state.region).toHaveProperty('id', 3);
    expect(state.region).toHaveProperty('acronym', 'SE');
    expect(state.region).toHaveProperty('name', 'Sudeste');
  });
});
