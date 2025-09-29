/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { City, listCityByName } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { describe, expect, it, vi } from 'vitest';

describe('listCityByName', () => {
  it('must return a list of cities with expected properties', async () => {
    const rawCities: [
      {
        id: number;
        nome: string;
        estado: string;
      },
    ] = [{ id: 2, nome: 'Suzano', estado: 'SP' }];

    const cities: City[] = [{ id: '2', name: 'Suzano', uf: Uf.SP }];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawCities),
    });

    global.fetch = mockFetch;

    const result = await listCityByName('Suzano');
    expect(result).toEqual(cities);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/cptec/v1/cidade'), {
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

    await expect(listCityByName('Suzano')).rejects.toThrow('Erro ao buscar a cidade pelo nome');
  });

  it('must throw an error if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(listCityByName('Suzano')).rejects.toThrow(
      'Tempo limite excedido ao buscar a cidade pelo nome',
    );
  });
});
