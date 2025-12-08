/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getFipeVehicleDataByCode } from '@src/index';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get fipe vehicle data by code - unit', () => {
  it('should return fipe vehicle data by code - unit', async () => {
    const rawData = [
      {
        valor: 'R$ 3.984.541,00',
        marca: 'Ferrari',
        modelo: '488 Pista 3.9 V8 720cv',
        anoModelo: 2020,
        combustivel: 'Gasolina',
        codigoFipe: '031046-8',
        mesReferencia: ' junho de 2022 ',
        tipoVeiculo: 1,
        siglaCombustivel: 'G',
        dataConsulta: '2022-07-08',
      },
      {
        valor: 'R$ 3.984.541,00',
        marca: 'Ferrari',
        modelo: '488 Pista 3.9 V8 720cv',
        anoModelo: 2019,
        combustivel: 'Gasolina',
        codigoFipe: '031046-8',
        mesReferencia: ' junho de 2022 ',
        tipoVeiculo: 1,
        siglaCombustivel: 'G',
        dataConsulta: '2022-07-08',
      },
    ];

    const fipeVehicleData = [
      {
        brand: 'Ferrari',
        model: '488 Pista 3.9 V8 720cv',
        fuel: 'Gasolina',
        fipeCode: '031046-8',
        referenceMonth: 'junho de 2022',
        vehicleType: 1,
        fuelAcronym: 'G',
        price: 'R$ 3.984.541,00',
        consultationDate: '2022-07-08',
        value: 'R$ 3.984.541,00',
        year: 2020,
      },
      {
        brand: 'Ferrari',
        model: '488 Pista 3.9 V8 720cv',
        fuel: 'Gasolina',
        fipeCode: '031046-8',
        referenceMonth: 'junho de 2022',
        vehicleType: 1,
        fuelAcronym: 'G',
        price: 'R$ 3.984.541,00',
        consultationDate: '2022-07-08',
        value: 'R$ 3.984.541,00',
        year: 2019,
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawData),
    });

    global.fetch = mockFetch;

    const data = await getFipeVehicleDataByCode('031046-8');

    expect(data).toEqual(fipeVehicleData);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/fipe/preco/v1/031046-8'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getFipeVehicleDataByCode('031046-8')).rejects.toBeInstanceOf(TimeoutError);
  });
});
