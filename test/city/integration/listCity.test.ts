import { listCityByName } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { describe, expect, it } from 'vitest';

describe('listCity', () => {
  it('should return cities with expected properties', async () => {
    const cities = await listCityByName('Suzano');

    expect(Array.isArray(cities)).toBe(true);
    expect(cities.length).toBeGreaterThan(0);
    expect(cities[0]).toHaveProperty('name');
    expect(cities[0]).toHaveProperty('id');
    expect(cities[0]).toHaveProperty('uf');

    expect(cities[0].name).toBe('Suzano');
    expect(cities[0].uf).toBe(Uf.SP);
    expect(cities[0].id).toBe('5268');
    expect(Object.values(Uf)).toContain(cities[0].uf);
  });
});
