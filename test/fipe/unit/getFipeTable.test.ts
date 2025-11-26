/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getFipeTables } from '@src/index';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get fipe table - unit', () => {
  it('should return all fipe tables - unit', async () => {
    const rawTables: {
      codigo: number;
      mes: string;
    }[] = [
      {
        codigo: 1,
        mes: 'janeiro de 2020',
      },
      {
        codigo: 2,
        mes: 'fevereiro de 2020',
      },
      {
        codigo: 3,
        mes: 'março de 2020',
      },
    ];

    const tablesResponse: {
      id: number;
      month: string;
    }[] = [
      {
        id: 1,
        month: 'janeiro de 2020',
      },
      {
        id: 2,
        month: 'fevereiro de 2020',
      },
      {
        id: 3,
        month: 'março de 2020',
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawTables),
    });

    global.fetch = mockFetch;

    const tables = await getFipeTables();

    expect(tables).toEqual(tablesResponse);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/fipe/tabelas/v1'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getFipeTables()).rejects.toBeInstanceOf(TimeoutError);
  });
});
