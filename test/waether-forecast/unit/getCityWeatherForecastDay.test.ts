/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getCityWeatherForecastDays, WeatherForecast } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('getCityWeatherForecastDays - unit', () => {
  it('should return weather forecast for a specific day for a given location', async () => {
    const rawWeatherForecast: {
      cidade: string;
      estado: string;
      atualizado_em: string;
      clima: {
        data: string;
        condicao: string;
        min: number;
        max: number;
        indice_uv: number;
        condicao_desc: string;
      }[];
    } = {
      cidade: 'Suzano',
      estado: 'SP',
      atualizado_em: '2025-10-23',
      clima: [
        {
          data: '2025-10-23',
          condicao: 'Ensolarado',
          min: 20,
          max: 30,
          indice_uv: 8,
          condicao_desc: 'Céu limpo e ensolarado',
        },
        {
          data: '2025-10-24',
          condicao: 'Ensolarado',
          min: 20,
          max: 30,
          indice_uv: 9,
          condicao_desc: 'Céu limpo e ensolarado',
        },
      ],
    };

    const mockedWeatherForecastResponse: WeatherForecast = {
      city: 'Suzano',
      uf: Uf.SP,
      updatedAt: new Date('2025-10-23'),
      forecast: rawWeatherForecast.clima.map((forecast) => ({
        date: new Date(forecast.data),
        condition: forecast.condicao,
        minTemperature: forecast.min,
        maxTemperature: forecast.max,
        UVIndex: forecast.indice_uv,
        conditionDescription: forecast.condicao_desc,
      })),
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawWeatherForecast),
    });

    global.fetch = mockFetch;

    const weatherForecast = await getCityWeatherForecastDays(5268, 2);

    expect(weatherForecast).toEqual(mockedWeatherForecastResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('cptec/v1/clima/previsao/5268/2'),
      {
        signal: expect.any(AbortSignal),
      },
    );
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getCityWeatherForecastDays(851, 2)).rejects.toBeInstanceOf(TimeoutError);
  });
});
