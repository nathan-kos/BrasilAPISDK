/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Broker, BrokerStatus, getBrokerByCnpj } from '@src/index';
import { Uf } from '@src/shared/enums/uf';
import { describe, expect, it, vi } from 'vitest';

describe('getBrokerByCnpj', () => {
  it('must return a broker with expected properties', async () => {
    const rawBrokers: {
      cnpj: string;
      type: string;
      nome_social: string;
      nome_comercial: string;
      status: string;
      email: string;
      telefone: string;
      cep: string;
      pais: string;
      uf: string;
      municipio: string;
      bairro: string;
      complemento?: string;
      logradouro: string;
      data_patrimonio_liquido: string;
      valor_patrimonio_liquido: number;
      codigo_cvm: string;
      data_inicio_situacao: string;
      data_registro: string;
    } = {
      cnpj: '12345678000195',
      type: 'CORRETORA',
      nome_social: 'Corretora Exemplo S.A.',
      nome_comercial: 'Corretora Exemplo',
      status: 'EM FUNCIONAMENTO NORMAL',
      email: 'contato@corretoraexemplo.com.br',
      telefone: '11987654321',
      cep: '01234-567',
      pais: 'Brasil',
      uf: 'SP',
      municipio: 'São Paulo',
      bairro: 'Centro',
      complemento: 'Sala 101',
      logradouro: 'Av. Paulista, 1000',
      data_patrimonio_liquido: '2023-01-01',
      valor_patrimonio_liquido: 1000000,
      codigo_cvm: '12345',
      data_inicio_situacao: '2020-01-01',
      data_registro: '2019-01-01',
    };

    const broker: Broker = {
      cnpj: '12345678000195',
      type: 'CORRETORA',
      socialName: 'Corretora Exemplo S.A.',
      comercialName: 'Corretora Exemplo',
      status: BrokerStatus.NORMAL,
      email: 'contato@corretoraexemplo.com.br',
      phone: '11987654321',
      cep: '01234-567',
      country: 'Brasil',
      uf: Uf.SP,
      city: 'São Paulo',
      neighborhood: 'Centro',
      complement: 'Sala 101',
      address: 'Av. Paulista, 1000',
      netEquityDate: new Date('2023-01-01'),
      netEquityValue: 1000000,
      cvmCode: '12345',
      situationStartDate: new Date('2020-01-01'),
      registrationDate: new Date('2019-01-01'),
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawBrokers),
    });

    global.fetch = mockFetch;

    const result = await getBrokerByCnpj('12345678000195');
    expect(result).toEqual(broker);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/cvm/corretoras/v1/12345678000195'),
      {
        signal: expect.any(AbortSignal),
      },
    );
  });

  it('must return not found when given an invalid CNPJ', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    global.fetch = mockFetch;

    await expect(getBrokerByCnpj('00000000000000')).rejects.toThrow(
      'Erro ao processar a resposta do servidor.',
    );
  });

  it('must throw an error if fetch fails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    global.fetch = mockFetch;

    await expect(getBrokerByCnpj('12345678000195')).rejects.toThrow(
      'Erro ao processar a resposta do servidor.',
    );
  });

  it('must throw an error if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getBrokerByCnpj('12345678000195')).rejects.toThrow(
      'Tempo limite excedido ao buscar corretora pelo CNPJ',
    );
  });
});
