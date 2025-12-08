import { getBrandsVehicleModel, VehicleType } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('get vehicle model - integration', () => {
  it('should return vehicle model by brand and vehicle type', async () => {
    const models = await getBrandsVehicleModel(VehicleType.CAR, 20);

    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBeGreaterThan(0);
    expect(models[0]).toHaveProperty('model');
  });

  it('should return a 500 error for non existing brand', async () => {
    await expect(getBrandsVehicleModel(VehicleType.CAR, 999999)).rejects.toThrowError(
      'Internal Server Error',
    );
  });
});
