import { listCityByName } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('should return city with fragment name', () => {
  it('should return city with fragment name', async () => {
    const cities = await listCityByName('Suzan');

    expect(Array.isArray(cities)).toBe(true);
    expect(cities.length).toBeGreaterThan(0);
    expect(cities[0]).toHaveProperty('name');
    expect(cities[0]).toHaveProperty('id');
    expect(cities[0]).toHaveProperty('uf');

    expect(typeof cities[0].name).toBe('string');
    expect(typeof cities[0].id).toBe('string');
    expect(typeof cities[0].uf).toBe('string');

    expect(cities[0].name.toLowerCase()).toContain('su'.toLowerCase());
  });
});
