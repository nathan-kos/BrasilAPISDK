import { getBrandByVehicleType, VehicleType } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('get brand by vehicle type - integration', () => {
  it('should return all brands by vehicle type', async () => {
    const brands = await getBrandByVehicleType(VehicleType.MOTORCYCLE);

    expect(Array.isArray(brands)).toBe(true);
    expect(brands.length).toBeGreaterThan(0);

    expect(brands[0]).toHaveProperty('name');
    expect(brands[0]).toHaveProperty('id');
  });
});
