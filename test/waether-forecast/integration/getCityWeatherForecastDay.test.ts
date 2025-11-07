/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getCityWeatherForecastDays } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { describe, expect, it } from 'vitest';

describe('getCityWeatherForecastDay - integration', () => {
  it('should return weather forecast for a specific day for a given location', async () => {
    const weatherForecastDay = await getCityWeatherForecastDays(5268, 3);

    expect(weatherForecastDay).toHaveProperty('city', 'Suzano');
    expect(weatherForecastDay).toHaveProperty('uf', Uf.SP);
    expect(weatherForecastDay).toHaveProperty('forecast');
    expect(weatherForecastDay).toHaveProperty('updatedAt');

    expect(weatherForecastDay.forecast).toBeInstanceOf(Array);
    expect(weatherForecastDay.forecast).toHaveLength(3);

    for (const forecast of weatherForecastDay.forecast) {
      expect(forecast).toMatchObject({
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
    await expect(getCityWeatherForecastDays(-1, 3)).rejects.toThrow(
      'Erro ao buscar previsões para a cidade',
    );
  });

  it('should return bad request when invalid days parameter is provided', async () => {
    await expect(getCityWeatherForecastDays(5268, 0)).rejects.toThrow(
      'O número de dias deve ser entre 1 e 6',
    );
  });
});
