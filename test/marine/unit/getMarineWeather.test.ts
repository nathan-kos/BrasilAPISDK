/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getMarineWeather } from '@src/index';
import { Direction } from '@src/modules/marine/entitie/directions';
import { MarineWeather } from '@src/modules/marine/entitie/marineWeather';
import { Uf } from '@src/shared/enums/uf';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('getMarineWeather - unit', () => {
  it('should return marine weather data for a given location', async () => {
    const rawMarineWeather: {
      cidade: string;
      estado: string;
      atualizado_em: string;
      ondas: {
        data: string;
        dados_ondas: {
          vento: number;
          direcao_vento: string;
          direcao_vento_desc: string;
          altura_onda: number;
          direcao_onda: string;
          direcao_onda_desc: string;
          agitation: string;
          hora: string;
        }[];
      }[];
    } = {
      cidade: 'Bertioga',
      estado: 'SP',
      atualizado_em: '2025-10-23',
      ondas: [
        {
          data: '2025-10-23',
          dados_ondas: [
            {
              vento: 15,
              direcao_vento: 'N',
              direcao_vento_desc: 'Norte',
              altura_onda: 1.5,
              direcao_onda: 'NE',
              direcao_onda_desc: 'Nordeste',
              agitation: 'Moderada',
              hora: '12:00',
            },
          ],
        },
      ],
    };

    const mockedMarineWeatherResponse: MarineWeather = {
      city: 'Bertioga',
      uf: Uf.SP,
      updatedAt: new Date('2025-10-23'),
      waves: [
        {
          date: new Date('2025-10-23'),
          data: [
            {
              wind: '15',
              windDirection: Direction.N,
              windDirectionDesc: 'Norte',
              waveHeight: '1.5',
              waveDirection: Direction.NE,
              waveDirectionDesc: 'Nordeste',
              agitation: 'Moderada',
              time: '12:00',
            },
          ],
        },
      ],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawMarineWeather),
    });

    global.fetch = mockFetch;

    const result = await getMarineWeather(851);

    expect(result).toEqual(mockedMarineWeatherResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('cptec/v1/ondas/851'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getMarineWeather(851)).rejects.toBeInstanceOf(TimeoutError);
  });

  it('should throw NotFoundError if location code is invalid', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Cidade não localizada' }),
    });

    global.fetch = mockFetch;

    await expect(getMarineWeather(581)).rejects.toThrow('Cidade não localizada');
  });
});
