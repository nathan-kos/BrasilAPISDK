/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getBrandByVehicleType, getBrandsVehicleModel, VehicleType } from '@src/index';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get vehicle model - integration', () => {
  it('should return vehicle model by brand and vehicle type', async () => {
    const rawModels: { modelo: string }[] = [
      {
        modelo: 'Roma 3.9 V8 620cv',
      },
      {
        modelo: '488 Pista 3.9 V8 720cv',
      },
      {
        modelo: 'F458 Speciale F1 4.5 V8',
      },
    ];

    const modelsResponse = [
      {
        model: 'Roma 3.9 V8 620cv',
      },
      {
        model: '488 Pista 3.9 V8 720cv',
      },
      {
        model: 'F458 Speciale F1 4.5 V8',
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawModels),
    });

    global.fetch = mockFetch;

    const brands = await getBrandsVehicleModel(VehicleType.CAR, 20);

    expect(brands).toEqual(modelsResponse);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/fipe/veiculos/v1/carros/20'), {
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
