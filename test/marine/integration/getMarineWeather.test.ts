/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getMarineWeather } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { describe, expect, it } from 'vitest';

describe('getMarineWeather', () => {
  it('should return marine weather data for a given location', async () => {
    const marineWeather = await getMarineWeather(851);

    expect(marineWeather).toHaveProperty('city', 'Bertioga');
    expect(marineWeather).toHaveProperty('uf', Uf.SP);
    expect(marineWeather).toHaveProperty('updatedAt', new Date('2025-10-23'));
    expect(Array.isArray(marineWeather.waves)).toBe(true);
    for (const wave of marineWeather.waves) {
      expect(wave).toHaveProperty('data');
      expect(Array.isArray(wave.data)).toBe(true);

      expect(wave.date).toEqual(expect.any(Date));

      for (const dataPoint of wave.data) {
        expect(dataPoint).toMatchObject({
          wind: expect.any(String),
          windDirection: expect.any(String),
          windDirectionDesc: expect.any(String),
          waveHeight: expect.any(String),
          waveDirection: expect.any(String),
          waveDirectionDesc: expect.any(String),
          agitation: expect.any(String),
          time: expect.any(String),
        });
      }
    }
  });
});
