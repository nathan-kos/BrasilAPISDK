/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getMarineWeatherDays } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { describe, expect, it } from 'vitest';

describe('getMarineWeatherDays', () => {
  it('should return marine weather data for multiple days', async () => {
    const marineWeatherDays = await getMarineWeatherDays(851, 3);

    expect(marineWeatherDays).toHaveProperty('city', 'Bertioga');
    expect(marineWeatherDays).toHaveProperty('uf', Uf.SP);
    expect(marineWeatherDays).toHaveProperty('updatedAt');
    expect(marineWeatherDays.updatedAt).toBeInstanceOf(Date);
    expect(Array.isArray(marineWeatherDays.waves)).toBe(true);
    expect(marineWeatherDays.waves.length).toBe(3);

    for (const wave of marineWeatherDays.waves) {
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
