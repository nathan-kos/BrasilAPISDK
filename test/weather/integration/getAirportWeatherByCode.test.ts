import { getAirportWeaterByCode } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('getAirportWeatherByCode', () => {
  it('should return weather information for a given airport code', async () => {
    const weather = await getAirportWeaterByCode('SBGR');

    expect(weather).toHaveProperty('ICAOCode');
    expect(weather).toHaveProperty('updatedAt');
    expect(weather).toHaveProperty('atmosphericPressure');
    expect(weather).toHaveProperty('visibility');
    expect(weather).toHaveProperty('wind');
    expect(weather).toHaveProperty('windDirection');
    expect(weather).toHaveProperty('humidity');
    expect(weather).toHaveProperty('condition');
    expect(weather).toHaveProperty('conditionDescription');
    expect(weather).toHaveProperty('temperature');

    expect(typeof weather.ICAOCode).toBe('string');
    expect(weather.updatedAt).toBeInstanceOf(Date);
    expect(typeof weather.atmosphericPressure).toBe('string');
    expect(typeof weather.visibility).toBe('string');
    expect(typeof weather.wind).toBe('string');
    expect(typeof weather.windDirection).toBe('string');
    expect(typeof weather.humidity).toBe('string');
    expect(typeof weather.condition).toBe('string');
    expect(typeof weather.conditionDescription).toBe('string');
    expect(typeof weather.temperature).toBe('string');
  });
});
