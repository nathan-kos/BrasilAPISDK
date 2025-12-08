import { getFipeTables } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('get fipe table - integration', () => {
  it('should return fipe tables', async () => {
    const tables = await getFipeTables();

    expect(Array.isArray(tables)).toBe(true);
    expect(tables.length).toBeGreaterThan(0);

    expect(tables[0]).toHaveProperty('id');
    expect(tables[0]).toHaveProperty('month');
  });
});
