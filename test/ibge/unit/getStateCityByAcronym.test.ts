/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getStateCityByAcronym } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get state city by acronym - unit', () => {
  it('should return cities for a given state acronym - unit', async () => {
    const rawCities: { nome: string; codigo_ibge: number }[] = [
      {
        nome: 'São Paulo',
        codigo_ibge: 3550308,
      },
      {
        nome: 'Campinas',
        codigo_ibge: 3509502,
      },
      {
        nome: 'Santos',
        codigo_ibge: 3548500,
      },
    ];

    const citiesResponse: { name: string; ibgeCode: number }[] = [
      {
        name: 'São Paulo',
        ibgeCode: 3550308,
      },
      {
        name: 'Campinas',
        ibgeCode: 3509502,
      },
      {
        name: 'Santos',
        ibgeCode: 3548500,
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawCities),
    });

    global.fetch = mockFetch;

    const cities = await getStateCityByAcronym(Uf.SP);

    expect(cities).toEqual(citiesResponse);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/ibge/municipios/v1/SP'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getStateCityByAcronym(Uf.SP)).rejects.toBeInstanceOf(TimeoutError);
  });
});
