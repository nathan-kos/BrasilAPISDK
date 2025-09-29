/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { City, listCities } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { describe, expect, it, vi } from 'vitest';

describe('List city', () => {
  it('should list city by name', async () => {
    const rawCity: {
      nome: string;
      id: number;
      estado: string;
    }[] = [
      {
        nome: 'Suzano',
        id: 5268,
        estado: 'SP',
      },
      {
        nome: 'São Paulo',
        id: 1234,
        estado: 'SP',
      },
    ];

    const City: City[] = [
      {
        name: 'Suzano',
        id: '5268',
        uf: Uf.SP,
      },
      {
        name: 'São Paulo',
        id: '1234',
        uf: Uf.SP,
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawCity),
    });

    global.fetch = mockFetch;

    const result = await listCities();
    expect(result).toEqual(City);
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

    await expect(listCities()).rejects.toThrow('Internal Server Error');
  });

  it('must throw an error if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(listCities()).rejects.toThrow('Tempo limite excedido ao buscar todas as cidades');
  });
});
