import { getAllRate } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('get all rate - integration', () => {
  it('should return all rates', async () => {
    const rates = await getAllRate();

    expect(Array.isArray(rates)).toBe(true);
    expect(rates.length).toBeGreaterThan(0);

    rates.forEach((rate) => {
      expect(rate).toHaveProperty('name');
      expect(rate).toHaveProperty('value');
    });
  });
});
