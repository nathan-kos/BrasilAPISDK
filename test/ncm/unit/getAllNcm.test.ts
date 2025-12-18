/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getAllNcm, NcmInfo } from '@src/index';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('getAllNcm - unit', () => {
  it('should return all mocked ncm data', async () => {
    const mockedNcm: {
      codigo: string;
      descricao: string;
      data_inicio: string;
      data_fim: string;
      tipo_ato: string;
      numero_ato: string;
      ano_ato: number;
    }[] = [
      {
        codigo: '1806.32.10',
        descricao: 'Chocolate',
        data_inicio: '2021-07-01',
        data_fim: '9999-12-31',
        tipo_ato: 'Res Camex',
        numero_ato: '272',
        ano_ato: 2021,
      },
      {
        codigo: '8903.99.90',
        descricao:
          'Transatlânticos, barcos de excursão e outros navios de passageiros semelhantes, não especificados nem compreendidos em outras posições',
        data_inicio: '2020-01-01',
        data_fim: '9999-12-31',
        tipo_ato: 'Res Camex',
        numero_ato: '10',
        ano_ato: 2020,
      },
    ];

    const ncmResponse: NcmInfo[] = [
      {
        code: '1806.32.10',
        description: 'Chocolate',
        startDate: new Date('2021-07-01'),
        endDate: new Date('9999-12-31'),
        actType: 'Res Camex',
        actNumber: '272',
        actYear: 2021,
      },
      {
        code: '8903.99.90',
        description:
          'Transatlânticos, barcos de excursão e outros navios de passageiros semelhantes, não especificados nem compreendidos em outras posições',
        startDate: new Date('2020-01-01'),
        endDate: new Date('9999-12-31'),
        actType: 'Res Camex',
        actNumber: '10',
        actYear: 2020,
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockedNcm),
    });

    global.fetch = mockFetch;

    const ncm = await getAllNcm();

    expect(ncm).toEqual(ncmResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/ncm/v1'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getAllNcm()).rejects.toBeInstanceOf(TimeoutError);
  });
});
