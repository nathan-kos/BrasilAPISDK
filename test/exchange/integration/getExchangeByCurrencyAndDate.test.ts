/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BulletinType, CurrencySymbol, GetExchangeByCurrencyAndDate } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('getExchangeByCurrencyAndDate', () => {
  it('should return exchange rates for a given currency and date', async () => {
    const exchangeRates = await GetExchangeByCurrencyAndDate(
      CurrencySymbol.EUR,
      new Date('2002-10-02'),
    );

    expect(exchangeRates).toHaveProperty('currency', CurrencySymbol.EUR);
    expect(exchangeRates).toHaveProperty('date', '2002-10-02');
    expect(Array.isArray(exchangeRates.bulletins)).toBe(true);
    for (const bulletin of exchangeRates.bulletins) {
      expect(bulletin).toMatchObject({
        buyParity: expect.any(Number),
        sellParity: expect.any(Number),
        buyRate: expect.any(Number),
        sellRate: expect.any(Number),
        timestamp: expect.any(Date),
      });

      expect(typeof bulletin.type).toBe('string');
      expect(Object.values(BulletinType)).toContain(bulletin.type);
    }
  });
});
