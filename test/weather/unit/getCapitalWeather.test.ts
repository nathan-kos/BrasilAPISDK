/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getCapitalWeather, Weather } from '@src/index';
import { describe, expect, it, vi } from 'vitest';

describe('getCapitalWeather', () => {
  it('should fetch and return capital weather data', async () => {
    const rawWeather: {
      codigo_icao: string;
      atualizado_em: string;
      pressao_atmosferica: string;
      visibilidade: string;
      vento: number;
      direcao_vento: number;
      umidade: number;
      condicao: string;
      condicao_Desc: string;
      temp: number;
    }[] = [
      {
        codigo_icao: 'ABC123',
        atualizado_em: '2023-10-01T12:00:00Z',
        pressao_atmosferica: '1013',
        visibilidade: '9000',
        vento: 15,
        direcao_vento: 180,
        umidade: 60,
        condicao: 'Clear',
        condicao_Desc: 'Clear sky',
        temp: 25,
      },
    ];

    const Weather: Weather[] = [
      {
        ICAOCode: 'ABC123',
        updatedAt: new Date('2023-10-01T12:00:00Z'),
        atmosphericPressure: '1013',
        visibility: '9000',
        wind: '15',
        windDirection: '180',
        humidity: '60',
        condition: 'Clear',
        conditionDescription: 'Clear sky',
        temperature: '25',
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawWeather),
    });

    global.fetch = mockFetch;

    const result = await getCapitalWeather();
    expect(result).toEqual(Weather);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/cptec/v1/clima/capital'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('must throw an error if fetch fails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ message: 'Internal Server Error' }),
    });

    global.fetch = mockFetch;

    await expect(getCapitalWeather()).rejects.toThrow('Erro ao buscar o clima da capital');
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

    await expect(getCapitalWeather()).rejects.toThrow('Tempo limite excedido');
  });
});
