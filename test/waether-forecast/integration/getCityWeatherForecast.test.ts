/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getCityWeatherForecast } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { describe, expect, it } from 'vitest';

describe('getWeatherForecast - integration', () => {
  it('should return weather forecast for a given location', async () => {
    const weatherForecast = await getCityWeatherForecast(5268);

    expect(weatherForecast).toHaveProperty('city', 'Suzano');
    expect(weatherForecast).toHaveProperty('uf', Uf.SP);
    expect(weatherForecast).toHaveProperty('forecast');
    expect(weatherForecast).toHaveProperty('updatedAt');
    expect(Array.isArray(weatherForecast.forecast)).toBe(true);

    for (const dayForecast of weatherForecast.forecast) {
      expect(dayForecast).toMatchObject({
        date: expect.any(Date),
        condition: expect.any(String),
        minTemperature: expect.any(Number),
        maxTemperature: expect.any(Number),
        UVIndex: expect.any(Number),
        conditionDescription: expect.any(String),
      });
    }
  });

  it('should return bad request when invalid city parameter is provided', async () => {
    await expect(getCityWeatherForecast(-1)).rejects.toThrow(
      'Erro ao buscar previsões para a cidade',
    );
  });
});
