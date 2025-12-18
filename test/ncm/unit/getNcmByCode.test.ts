/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getNcmByCode } from '@src/index';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get ncm by code - unit', () => {
  it('should get ncm by code successfully', async () => {
    const mockedNcm = {
      codigo: '1806.32.10',
      descricao: 'Chocolate',
      data_inicio: '2021-07-01',
      data_fim: '9999-12-31',
      tipo_ato: 'Res Camex',
      numero_ato: '272',
      ano_ato: 2021,
    };

    const ncmResponse = {
      code: '1806.32.10',
      description: 'Chocolate',
      startDate: new Date('2021-07-01'),
      endDate: new Date('9999-12-31'),
      actType: 'Res Camex',
      actNumber: '272',
      actYear: 2021,
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockedNcm),
    });

    global.fetch = mockFetch;

    const ncm = await getNcmByCode('1806.32.10');

    expect(ncm).toEqual(ncmResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/ncm/v1/1806.32.10'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getNcmByCode('1806.32.10')).rejects.toBeInstanceOf(TimeoutError);
  });

  it('should throw NotFoundError if ncm code does not exist', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Not Found' }),
    });

    global.fetch = mockFetch;

    await expect(getNcmByCode('0000.00.00')).rejects.toThrow('Not Found');
  });
});
