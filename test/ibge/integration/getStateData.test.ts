import { getStateData } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('get state data - integration', () => {
  it('should return all states data', async () => {
    const states = await getStateData();

    expect(Array.isArray(states)).toBe(true);
    expect(states.length).toEqual(27);

    expect(states[0]).toHaveProperty('id');
    expect(states[0]).toHaveProperty('name');
    expect(states[0]).toHaveProperty('acronym');
    expect(states[0]).toHaveProperty('region');

    expect(states[0].region).toHaveProperty('id');
    expect(states[0].region).toHaveProperty('acronym');
    expect(states[0].region).toHaveProperty('name');
  });
});
