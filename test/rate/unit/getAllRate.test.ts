/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getAllRate, Rate } from '@src/index';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get all rate - unit', () => {
  it('should return all rates', async () => {
    const mockedRates: { nome: string; valor: number }[] = [
      { nome: 'CDI', valor: 14.9 },
      { nome: 'Selic', valor: 15 },
      { nome: 'IPCA', valor: 4.46 },
    ];

    const ratesResponse: Rate[] = [
      { name: 'CDI', value: 14.9 },
      { name: 'Selic', value: 15 },
      { name: 'IPCA', value: 4.46 },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockedRates),
    });

    global.fetch = mockFetch;

    const rates = await getAllRate();

    expect(rates).toEqual(ratesResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/taxas/v1'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getAllRate()).rejects.toBeInstanceOf(TimeoutError);
  });
});
