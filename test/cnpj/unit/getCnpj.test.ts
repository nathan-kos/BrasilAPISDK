/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getCnpj } from '@src/index';
import { BadRequestError } from '@src/shared/exceptions/BadRequestError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('getCnpj', () => {
  it('should return the expected CNPJ object when fetch succeeds', async () => {
    const mockRawCnpj = {
      cnpj: '00000000000191',
      razao_social: 'Empresa Teste LTDA',
      nome_fantasia: 'Empresa Teste',
      uf: 'SP',
      cep: '01000-000',
      porte: 'ME',
      codigo_porte: 1,
      situacao_cadastral: 2,
      data_inicio_atividade: '2020-01-01T00:00:00Z',
      data_opcao_pelo_mei: '2020-01-01T00:00:00Z',
      data_exclusao_do_simples: '2020-01-01T00:00:00Z',
      data_situacao_especial: '2020-01-01T00:00:00Z',
      descricao_situacao_cadastral: 'Ativa',
      identificador_matriz_filial: 1,
      descricao_identificador_matriz_filial: 'Matriz',
      descricao_motivo_situacao_cadastral: 'Regular',
      descricao_tipo_de_logradouro: 'Rua',
      motivo_situacao_cadastral: 0,
      qualificacao_do_responsavel: 49,
      ente_federativo_responsavel: '',
      codigo_natureza_juridica: 2062,
      nome_cidade_no_exterior: '',
      data_opcao_pelo_simples: '2020-01-01T00:00:00Z',
      codigo_municipio_ibge: 3550308,
      cnae_fiscal_descricao: 'Desenvolvimento de Software',
      data_exclusao_do_mei: '2020-01-01T00:00:00Z',
      natureza_juridica: '2062',
      logradouro: 'Rua Teste',
      bairro: 'Centro',
      numero: '123',
      complemento: '',
      municipio: 'São Paulo',
      ddd_telefone_1: '11',
      ddd_telefone_2: '12',
      ddd_fax: '13',
      email: 'teste@empresa.com.br',
      capital_social: 100000,
      opcao_pelo_mei: true,
      opcao_pelo_simples: true,
      cnae_fiscal: 6201,
      codigo_pais: 1058,
      pais: 'Brasil',
      qsa: [
        {
          nome_socio: 'João da Silva',
          faixa_etaria: 'DE_30_A_39_ANOS',
          cnpj_cpf_do_socio: '12345678900',
          qualificacao_socio: 'Sócio-Administrador',
          codigo_faixa_etaria: 4,
          data_entrada_sociedade: '2019-01-01T00:00:00Z',
          identificador_de_socio: 1,
          cpf_representante_legal: '00000000000',
          nome_representante_legal: 'Maria Souza',
          codigo_qualificacao_socio: 10,
          qualificacao_representante_legal: 'Administrador',
          codigo_qualificacao_representante_legal: 5,
        },
      ],
      cnaes_secundarios: [
        {
          codigo: '6202',
          descricao: 'Consultoria em TI',
        },
      ],
      regime_tributario: [
        {
          ano: 2020,
          forma_de_tributacao: 'Lucro Real',
          quantidade_de_escrituracoes: 2,
        },
      ],
      fullName: 'Empresa Teste LTDA',
      companySize: 'ME',
      startDate: '2020-01-01T00:00:00Z',
      registrationStatus: 2,
      specialSituation: '',
      specialSituationDate: '2020-01-01T00:00:00Z',
      simples: true,
      mei: true,
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => mockRawCnpj,
    });

    global.fetch = mockFetch;

    const result = await getCnpj('00.000.000/0001-91');

    expect(result.cnpj).toBe('00000000000191');
    expect(result.companyName).toBe('Empresa Teste LTDA');
    expect(result.fantasyName).toBe('Empresa Teste');
    expect(result.uf).toBe('SP');
    expect(result.cep).toBe('01000-000');
    expect(result.qsa).toBeDefined();
    expect(Array.isArray(result.qsa)).toBe(true);
    expect(result.qsa?.[0].memberName).toBe('João da Silva');
  });

  it('should return a BadRequestError for an invalid CNPJ', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: () => ({ message: 'CNPJ inválido' }),
    });

    global.fetch = mockFetch;

    await expect(getCnpj('00.000.000/0001-00')).rejects.toBeInstanceOf(BadRequestError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/cnpj/v1/00000000000100'),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('should throw a TimeoutError for a request timeout', async () => {
    const abortError = new Error('The user aborted a request.');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getCnpj('00.000.000/0001-91')).rejects.toBeInstanceOf(TimeoutError);
  });
});
