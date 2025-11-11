/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getDddInfo } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { BadRequestError } from '@src/shared/exceptions/BadRequestError';
import { NotFoundError } from '@src/shared/exceptions/NotFoundError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get ddd info - unit', () => {
  it('should return ddd info for a specific ddd', async () => {
    const rawDddInfo: {
      state: string;
      cities: string[];
    } = {
      state: 'SP',
      cities: ['Suzano', 'São Paulo', 'Mogi das Cruzes'],
    };

    const dddInfoResponse: {
      state: Uf;
      cities: string[];
    } = {
      state: Uf.SP,
      cities: ['Suzano', 'São Paulo', 'Mogi das Cruzes'],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawDddInfo),
    });

    global.fetch = mockFetch;

    const dddInfo = await getDddInfo(11);

    expect(dddInfo).toEqual(dddInfoResponse);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/ddd/v1/11'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getDddInfo(11)).rejects.toBeInstanceOf(TimeoutError);
  });

  it('should throw an error if the response status is 404 (not found)', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    global.fetch = mockFetch;

    await expect(getDddInfo(11)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('should throw an error if the response status is 400 (bad request)', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
    });

    global.fetch = mockFetch;

    await expect(getDddInfo(11)).rejects.toBeInstanceOf(BadRequestError);
  });
});
