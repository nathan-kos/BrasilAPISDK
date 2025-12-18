/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getNcmByCodeOrDescription } from '@src/index';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('getNcmByCodeOrDescription - unit', () => {
  it('should return mocked ncm data by code or description', async () => {
    const mockedNcm = [
      {
        codigo: '1806.32.10',
        descricao: 'Chocolate',
        data_inicio: '2021-07-01',
        data_fim: '9999-12-31',
        tipo_ato: 'Res Camex',
        numero_ato: '272',
        ano_ato: 2021,
      },
    ];

    const ncmResponse = [
      {
        code: '1806.32.10',
        description: 'Chocolate',
        startDate: new Date('2021-07-01'),
        endDate: new Date('9999-12-31'),
        actType: 'Res Camex',
        actNumber: '272',
        actYear: 2021,
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockedNcm),
    });

    global.fetch = mockFetch;

    const ncm = await getNcmByCodeOrDescription('Chocolate');

    expect(ncm).toEqual(ncmResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/ncm/v1?search=Chocolate'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getNcmByCodeOrDescription('9788576672666')).rejects.toBeInstanceOf(TimeoutError);
  });

  it('should return empty array if no ncm found', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    global.fetch = mockFetch;

    const ncm = await getNcmByCodeOrDescription('NonExistingNcm');

    expect(ncm).toEqual([]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/ncm/v1?search=NonExistingNcm'),
      {
        signal: expect.any(AbortSignal),
      },
    );
  });
});
