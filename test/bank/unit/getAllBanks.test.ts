/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getAllBanks } from '@src/modules/bank';
import { Bank } from '@src/modules/bank/entities/Bank';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { describe, expect, it, vi } from 'vitest';

describe('getAllBanks - unit', () => {
  it('deve retornar os dados corretamente quando o fetch for bem-sucedido', async () => {
    const mockedBanks: Bank[] = [
      {
        ispb: '12345678',
        name: 'Banco Teste',
        code: 999,
        fullName: 'Banco de Teste S.A.',
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => mockedBanks,
    });

    global.fetch = mockFetch;

    const result = await getAllBanks();
    expect(result).toEqual(mockedBanks);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/banks/v1'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('deve lançar erro se o fetch retornar status não-ok', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Erro interno',
      json: () => ({ message: 'Erro interno' }),
    });

    global.fetch = mockFetch;

    await expect(getAllBanks()).rejects.toBeInstanceOf(ServerError);
  });
});
