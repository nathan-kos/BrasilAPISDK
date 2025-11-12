import { getHolidaysByYear } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('get holidays by year - integration', () => {
  it('should return all holidays by year', async () => {
    const holidays = await getHolidaysByYear(2002);

    expect(Array.isArray(holidays)).toBe(true);
    expect(holidays.length).toBeGreaterThan(0);

    expect(holidays[0]).toHaveProperty('date');
    expect(holidays[0]).toHaveProperty('name');
    expect(holidays[0]).toHaveProperty('type');
  });

  it('should throw bad request if year is invalid', async () => {
    await expect(getHolidaysByYear(2200)).rejects.toThrow(
      'Ano de consulta deve estar entre 1900 e 2199',
    );
  });
});
