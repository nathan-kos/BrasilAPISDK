/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Currency, getAllCurrency } from '@src/index';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('getAllCurrency - unit', () => {
  it('should return currency data correctly when fetch is successful', async () => {
    const mockedRawCurrencies: { simbolo: string; nome: string; tipo_moeda: string }[] = [
      {
        simbolo: 'EUR',
        nome: 'Euro',
        tipo_moeda: 'B',
      },
    ];

    const mockedCurrencies: Currency[] = [
      {
        symbol: 'EUR',
        name: 'Euro',
        type: 'B',
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockedRawCurrencies),
    });

    global.fetch = mockFetch;

    const result = await getAllCurrency();
    expect(result).toEqual(mockedCurrencies);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/cambio/v1/moedas'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw ServerError if fetch returns non-ok status', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ message: 'Internal Server Error' }),
    });

    global.fetch = mockFetch;

    await expect(getAllCurrency()).rejects.toBeInstanceOf(ServerError);
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getAllCurrency()).rejects.toBeInstanceOf(TimeoutError);
  });

  it('should throw ServerError if fetch fails unexpectedly', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Unexpected'));

    global.fetch = mockFetch;

    await expect(getAllCurrency()).rejects.toBeInstanceOf(ServerError);
  });
});
