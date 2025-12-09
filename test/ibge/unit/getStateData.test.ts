/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getStateData } from '@src/index';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get state data - integration', () => {
  it('should return all states data', async () => {
    const rawStates = [
      {
        id: 35,
        sigla: 'SP',
        nome: 'São Paulo',
        regiao: {
          id: 3,
          sigla: 'SE',
          nome: 'Sudeste',
        },
      },
      {
        id: 43,
        sigla: 'RS',
        nome: 'Rio Grande do Sul',
        regiao: {
          id: 4,
          sigla: 'S',
          nome: 'Sul',
        },
      },
      {
        id: 31,
        sigla: 'MG',
        nome: 'Minas Gerais',
        regiao: {
          id: 3,
          sigla: 'SE',
          nome: 'Sudeste',
        },
      },
    ];

    const statesResponse = [
      {
        id: 35,
        acronym: 'SP',
        name: 'São Paulo',
        region: {
          id: 3,
          acronym: 'SE',
          name: 'Sudeste',
        },
      },
      {
        id: 43,
        acronym: 'RS',
        name: 'Rio Grande do Sul',
        region: {
          id: 4,
          acronym: 'S',
          name: 'Sul',
        },
      },
      {
        id: 31,
        acronym: 'MG',
        name: 'Minas Gerais',
        region: {
          id: 3,
          acronym: 'SE',
          name: 'Sudeste',
        },
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawStates),
    });

    global.fetch = mockFetch;

    const states = await getStateData();

    expect(states).toEqual(statesResponse);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/ibge/uf/v1'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getStateData()).rejects.toBeInstanceOf(TimeoutError);
  });
});
