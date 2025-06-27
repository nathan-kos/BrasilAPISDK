import { getBankByCode } from '@src/index';
import { NotFoundError } from '@src/shared/exceptions/NotFoundError';
import { describe, expect, it } from 'vitest';

describe('getBankByCode', () => {
  it('deve retornar um banco válido com propriedades esperadas', async () => {
    const bank = await getBankByCode('1');

    expect(bank).toHaveProperty('name');
    expect(bank).toHaveProperty('code');
    expect(bank).toHaveProperty('ispb');
    expect(bank).toHaveProperty('fullName');
  });

  it('deve lançar erro se o código do banco for inválido', async () => {
    await expect(getBankByCode('NKS')).rejects.toBeInstanceOf(NotFoundError);
  });
});
