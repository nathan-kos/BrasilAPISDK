/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getBrandByVehicleType, VehicleType } from '@src/index';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get brand by vehicle type - unit', () => {
  it('should return all brands for a specific vehicle type - unit', async () => {
    const rawBrands: { nome: string; valor: string }[] = [
      {
        nome: 'Honda',
        valor: '1',
      },
      {
        nome: 'Toyota',
        valor: '2',
      },
      {
        nome: 'Ferrari',
        valor: '3',
      },
    ];

    const brandsResponse: { name: string; id: string }[] = [
      {
        name: 'Honda',
        id: '1',
      },
      {
        name: 'Toyota',
        id: '2',
      },
      {
        name: 'Ferrari',
        id: '3',
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawBrands),
    });

    global.fetch = mockFetch;

    const brands = await getBrandByVehicleType(VehicleType.CAR);

    expect(brands).toEqual(brandsResponse);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/fipe/marcas/v1/carros'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getBrandByVehicleType(VehicleType.CAR)).rejects.toBeInstanceOf(TimeoutError);
  });
});
