import { getAllCurrency } from '@src/modules/currency';
import { describe, expect, it } from 'vitest';

describe('getAllCurrency', () => {
  it('should return a list of currencies with expected properties', async () => {
    const currencies = await getAllCurrency();
    expect(Array.isArray(currencies)).toBe(true);
    expect(currencies.length).toBeGreaterThan(0);

    const sample = currencies[0];
    expect(sample).toHaveProperty('symbol');
    expect(sample).toHaveProperty('name');
    expect(sample).toHaveProperty('type');
  });
});
