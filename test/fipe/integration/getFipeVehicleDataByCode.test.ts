import { getFipeVehicleDataByCode } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('get fipe vehicle data by code - integration', () => {
  it('should return fipe vehicle data by code', async () => {
    const data = await getFipeVehicleDataByCode('031046-8');

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    expect(data[0]).toHaveProperty('brand');
    expect(data[0]).toHaveProperty('model');
    expect(data[0]).toHaveProperty('fuel');
    expect(data[0]).toHaveProperty('fipeCode');
    expect(data[0]).toHaveProperty('referenceMonth');
    expect(data[0]).toHaveProperty('vehicleType');
    expect(data[0]).toHaveProperty('fuelAcronym');
    expect(data[0]).toHaveProperty('price');
    expect(data[0]).toHaveProperty('consultationDate');
    expect(data[0]).toHaveProperty('value');
    expect(data[0]).toHaveProperty('year');
  });

  it('should return fipe vehicle data by code and reference table', async () => {
    const data = await getFipeVehicleDataByCode('031046-8', '286');

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    expect(data[0]).toHaveProperty('brand');
    expect(data[0]).toHaveProperty('model');
    expect(data[0]).toHaveProperty('fuel');
    expect(data[0]).toHaveProperty('fipeCode');
    expect(data[0]).toHaveProperty('referenceMonth', 'junho de 2022');
    expect(data[0]).toHaveProperty('vehicleType');
    expect(data[0]).toHaveProperty('fuelAcronym');
    expect(data[0]).toHaveProperty('price');
    expect(data[0]).toHaveProperty('consultationDate');
    expect(data[0]).toHaveProperty('value');
    expect(data[0]).toHaveProperty('year');
  });
});
