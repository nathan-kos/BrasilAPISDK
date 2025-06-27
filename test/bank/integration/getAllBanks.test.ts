import { getAllBanks } from '@src/modules/bank';
import { describe, expect, it } from 'vitest';

describe('getAllBanks', () => {
  it('deve retornar uma lista de bancos com propriedades esperadas', async () => {
    const banks = await getAllBanks();
    expect(Array.isArray(banks)).toBe(true);
    expect(banks.length).toBeGreaterThan(0);

    const sample = banks[0];
    expect(sample).toHaveProperty('name');
    expect(sample).toHaveProperty('code');
    expect(sample).toHaveProperty('ispb');
    expect(sample).toHaveProperty('fullName');
  });
});
