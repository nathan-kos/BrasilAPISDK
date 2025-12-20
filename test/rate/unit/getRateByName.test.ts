/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getRateByName } from '@src/modules/rate/service/getRateByName';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get rate by name - unit', () => {
  it('should return rate by name', async () => {
    const mockedRate: { nome: string; valor: number } = {
      nome: 'CDI',
      valor: 14.9,
    };

    const rateResponse = {
      name: 'CDI',
      value: 14.9,
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockedRate),
    });

    global.fetch = mockFetch;

    const rate = await getRateByName('cdi');

    expect(rate).toEqual(rateResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/taxas/v1/cdi'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getRateByName('cdi')).rejects.toBeInstanceOf(TimeoutError);
  });

  it('should return 404 error if rate not found', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Taxa ou Índice não encontrada.' }),
    });

    global.fetch = mockFetch;

    await expect(getRateByName('unknown-rate')).rejects.toThrow('Taxa ou Índice não encontrada.');
  });
});
