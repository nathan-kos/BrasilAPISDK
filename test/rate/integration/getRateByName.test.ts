import { getRateByName } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('get rate by name - integration', () => {
  it('should fetch rate by name', async () => {
    const rateName = 'cdi';

    const rate = await getRateByName(rateName);

    expect(rate).toHaveProperty('name', 'CDI');
    expect(rate).toHaveProperty('value');
    expect(typeof rate.value).toBe('number');
  });
});
