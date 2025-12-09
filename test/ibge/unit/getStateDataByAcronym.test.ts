/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getStateDataByAcronym } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get state data by acronym - unit', () => {
  it('should return state data for a given acronym - unit', async () => {
    const rawState = {
      id: 35,
      sigla: 'SP',
      nome: 'São Paulo',
      regiao: {
        id: 3,
        sigla: 'SE',
        nome: 'Sudeste',
      },
    };

    const stateResponse = {
      id: 35,
      acronym: 'SP',
      name: 'São Paulo',
      region: {
        id: 3,
        acronym: 'SE',
        name: 'Sudeste',
      },
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawState),
    });

    global.fetch = mockFetch;

    const state = await getStateDataByAcronym(Uf.SP);

    expect(state).toEqual(stateResponse);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/ibge/uf/v1/SP'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getStateDataByAcronym(Uf.SP)).rejects.toBeInstanceOf(TimeoutError);
  });
});
