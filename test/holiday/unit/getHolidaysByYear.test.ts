/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getHolidaysByYear } from '@src/index';
import { NotFoundError } from '@src/shared/exceptions/NotFoundError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get holidays by year', () => {
  it('should return all holidays for a specific year - unit', async () => {
    const rawHolidays: {
      date: string;
      name: string;
      type: string;
    }[] = [
      {
        date: '2025-01-01',
        name: 'Confraternização mundial',
        type: 'national',
      },
      {
        date: '2025-02-12',
        name: 'Carnaval',
        type: 'national',
      },
    ];

    const holidaysResponse: {
      date: Date;
      name: string;
      type: string;
    }[] = [
      {
        date: new Date('2025-01-01'),
        name: 'Confraternização mundial',
        type: 'national',
      },
      {
        date: new Date('2025-02-12'),
        name: 'Carnaval',
        type: 'national',
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawHolidays),
    });

    global.fetch = mockFetch;

    const holidays = await getHolidaysByYear(2025);

    expect(holidays).toEqual(holidaysResponse);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/feriados/v1/2025'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getHolidaysByYear(2025)).rejects.toBeInstanceOf(TimeoutError);
  });

  it('should throw an error if the response status is 404 (not found)', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    global.fetch = mockFetch;

    await expect(getHolidaysByYear(2025)).rejects.toBeInstanceOf(NotFoundError);
  });
});
