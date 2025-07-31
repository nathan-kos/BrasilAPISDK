/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { BulletinType, CurrencySymbol, Exchange, GetExchangeByCurrencyAndDate } from '@src/index';
import { describe, expect, it, vi } from 'vitest';

describe('getExchangeByCurrencyAndDate - unit', () => {
  it('should return exchange data correctly when fetch is successful', async () => {
    const mockedExchangeRawData: {
      cotacoes: {
        paridade_compra: number;
        paridade_venda: number;
        cotacao_compra: number;
        cotacao_venda: number;
        data_hora_cotacao: string;
        tipo_boletim: string;
      }[];
      moeda: string;
      data: string;
    } = {
      cotacoes: [
        {
          paridade_compra: 1.1,
          paridade_venda: 1.2,
          cotacao_compra: 1.15,
          cotacao_venda: 1.25,
          data_hora_cotacao: '2022-01-01T00:00:00Z',
          tipo_boletim: 'ABERTURA',
        },
      ],
      moeda: 'EUR',
      data: '2022-01-01',
    };

    const mockedExchangeData: Exchange = {
      currency: CurrencySymbol.EUR,
      date: '2022-01-01',
      bulletins: [
        {
          buyParity: 1.1,
          sellParity: 1.2,
          buyRate: 1.15,
          sellRate: 1.25,
          timestamp: new Date('2022-01-01T00:00:00Z'),
          type: BulletinType.ABERTURA,
        },
      ],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockedExchangeRawData),
    });

    global.fetch = mockFetch;

    const result = await GetExchangeByCurrencyAndDate(CurrencySymbol.EUR, new Date('2022-01-01'));
    expect(result).toEqual(mockedExchangeData);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/cambio/v1/cotacao/EUR/2022-01-01'),
      {
        signal: expect.any(AbortSignal),
      },
    );
  });

  it('should throw BadRequestError if date is before 1984-11-28', async () => {
    await expect(
      GetExchangeByCurrencyAndDate(CurrencySymbol.EUR, new Date('1984-11-27')),
    ).rejects.toThrow('Date must be after 28/11/1984');
  });

  it('should throw BadRequestError if date is invalid', async () => {
    await expect(
      GetExchangeByCurrencyAndDate(CurrencySymbol.EUR, new Date('invalid-date')),
    ).rejects.toThrow('Invalid date provided');
  });

  it('should throw BadRequestError if no exchange data found', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ cotacoes: [], moeda: 'EUR', data: '2022-01-01' }),
    });

    global.fetch = mockFetch;
    await expect(
      GetExchangeByCurrencyAndDate(CurrencySymbol.EUR, new Date('2022-01-01')),
    ).rejects.toThrow('No exchange data found for the given currency and date');
  });

  it('should handle fetch errors gracefully', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = mockFetch;

    await expect(
      GetExchangeByCurrencyAndDate(CurrencySymbol.EUR, new Date('2022-01-01')),
    ).rejects.toThrow('Error fetching exchange data for the given currency and date');
  });
});
