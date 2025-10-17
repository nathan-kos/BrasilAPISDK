/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getAirportWeaterByCode, Weather } from '@src/index';
import { describe, expect, it, vi } from 'vitest';

describe('getAirportWeatherByCode', () => {
  it('should fetch and return airport weather data by ICAO code', async () => {
    const rawWeather: {
      codigo_icao: string;
      atualizado_em: string;
      pressao_atmosferica: string;
      visibilidade: string;
      vento: number;
      direcao_vento: number;
      umidade: number;
      condicao: string;
      condicao_desc: string;
      temp: number;
    } = {
      codigo_icao: 'SBGR',
      atualizado_em: '2023-03-15T12:00:00Z',
      pressao_atmosferica: '1013',
      visibilidade: '9000',
      vento: 5,
      direcao_vento: 180,
      umidade: 60,
      condicao: 'Céu limpo',
      condicao_desc: 'Sem nuvens',
      temp: 25,
    };

    const Weather: Weather = {
      ICAOCode: 'SBGR',
      updatedAt: new Date('2023-03-15T12:00:00Z'),
      atmosphericPressure: '1013',
      visibility: '9000',
      wind: '5',
      windDirection: '180',
      humidity: '60',
      condition: 'Céu limpo',
      conditionDescription: 'Sem nuvens',
      temperature: '25',
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawWeather),
    });

    global.fetch = mockFetch;

    const result = await getAirportWeaterByCode('SBGR');
    expect(result).toEqual(Weather);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/cptec/v1/clima/aeroporto/SBGR'),
      {
        signal: expect.any(AbortSignal),
      },
    );
  });

  it('should throw an error if the fetch fails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Fetch failed' }),
    });

    global.fetch = mockFetch;

    await expect(getAirportWeaterByCode('SBGR')).rejects.toThrow(
      'Erro ao buscar o clima do aeroporto',
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/cptec/v1/clima/aeroporto/SBGR'),
      {
        signal: expect.any(AbortSignal),
      },
    );
  });

  it('must throw an error if fetch is aborted', async () => {
    const mockFetch = vi.fn().mockImplementation(() => {
      return new Promise((_, reject) => {
        const error = new Error('The user aborted a request.');
        error.name = 'AbortError';
        reject(error);
      });
    });

    global.fetch = mockFetch;

    await expect(getAirportWeaterByCode('SBGR')).rejects.toThrow('Tempo limite excedido');
  });
});
