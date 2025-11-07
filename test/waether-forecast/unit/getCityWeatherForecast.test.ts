/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getCityWeatherForecast, WeatherForecast } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('getCityWeatherForecast - unit', () => {
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
      ],
    };

    const mockedWeatherForecastResponse: WeatherForecast = {
      city: 'Suzano',
      uf: Uf.SP,
      updatedAt: new Date('2025-10-23'),
      forecast: rawWeatherForecast.clima.map(() => ({
        date: new Date('2025-10-23'),
        condition: 'Ensolarado',
        minTemperature: 20,
        maxTemperature: 30,
        UVIndex: 8,
        conditionDescription: 'Céu limpo e ensolarado',
      })),
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawWeatherForecast),
    });

    global.fetch = mockFetch;

    const weatherForecast = await getCityWeatherForecast(5268);

    expect(weatherForecast).toEqual(mockedWeatherForecastResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('cptec/v1/clima/previsao/5268'),
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

    await expect(getCityWeatherForecast(851)).rejects.toBeInstanceOf(TimeoutError);
  });
});
