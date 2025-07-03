/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Bank, getBankByCode } from '@src/index';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeOutError';
import { describe, expect, it, vi } from 'vitest';

describe('getBankByCode', () => {
  it('deve retornar os dados corretamente quando o fetch for bem-sucedido', async () => {
    const mockBank: Bank = {
      ispb: '12345678',
      name: 'Banco Teste',
      code: 999,
      fullName: 'Banco de Teste S.A.',
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => mockBank,
    });

    global.fetch = mockFetch;

    const result = await getBankByCode('999');

    expect(result).toEqual(mockBank);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/banks/v1/999'),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('deve lançar erro se o código do banco não for encontrado', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: () => ({ message: 'Banco não encontrado' }),
    });

    global.fetch = mockFetch;

    await expect(getBankByCode('NKS')).rejects.toThrow('Banco não encontrado');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/banks/v1/NKS'),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('deve lançar erro se ocorrer um problema na requisição', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new ServerError());

    global.fetch = mockFetch;

    await expect(getBankByCode('999')).rejects.toBeInstanceOf(ServerError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/banks/v1/999'),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('deve lançar TimeoutError se o fetch for abortado', async () => {
    const abortError = new Error('The user aborted a request.');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getBankByCode('999')).rejects.toBeInstanceOf(TimeoutError);
  });
});
