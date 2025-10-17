import { getCapitalWeather } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('getCapitalWather', () => {
  it('should return weather information for a given capital city and date', async () => {
    const weather = await getCapitalWeather();

    expect(Array.isArray(weather)).toBe(true);
    expect(weather.length).toBeGreaterThan(0);
    expect(weather[0]).toHaveProperty('ICAOCode');
    expect(weather[0]).toHaveProperty('updatedAt');
    expect(weather[0]).toHaveProperty('atmosphericPressure');
    expect(weather[0]).toHaveProperty('visibility');
    expect(weather[0]).toHaveProperty('wind');
    expect(weather[0]).toHaveProperty('windDirection');
    expect(weather[0]).toHaveProperty('humidity');
    expect(weather[0]).toHaveProperty('condition');
    expect(weather[0]).toHaveProperty('conditionDescription');
    expect(weather[0]).toHaveProperty('temperature');

    expect(typeof weather[0].ICAOCode).toBe('string');
    expect(weather[0].updatedAt).toBeInstanceOf(Date);
    expect(typeof weather[0].atmosphericPressure).toBe('string');
    expect(typeof weather[0].visibility).toBe('string');
    expect(typeof weather[0].wind).toBe('string');
    expect(typeof weather[0].windDirection).toBe('string');
    expect(typeof weather[0].humidity).toBe('string');
    expect(typeof weather[0].condition).toBe('string');
    expect(typeof weather[0].conditionDescription).toBe('string');
    expect(typeof weather[0].temperature).toBe('string');
  });
});
