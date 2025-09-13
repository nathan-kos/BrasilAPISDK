import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { Uf } from '../../../shared/enums/uf';
import { AgeRange } from '../entities/agegroup';
import { Cnpj } from '../entities/cnpj';
import { CompanySize } from '../entities/size';

async function getCnpj(cnpj: string): Promise<Cnpj> {
  const cleanedCnpj = cnpj.replace(/\D/g, '');
  const url = `${getBaseUrl()}/cnpj/v1/${cleanedCnpj}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), getTimeout());

    console.log(url);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'meu-app/1.0',
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleResponseError(response);
    }

    const rawCnpjData = (await response.json()) as RawCnpj;

    const cnpjData: Cnpj = {
      uf: rawCnpjData.uf,
      cep: rawCnpjData.cep,
      qsa: rawCnpjData.qsa.map((socio) => ({
        country: socio.pais,
        memberName: socio.nome_socio,
        countryCode: socio.codigo_pais,
        ageRange: socio.faixa_etaria,
        cpf_cnpj: socio.cnpj_cpf_do_socio,
        partnerQualification: socio.qualificacao_socio,
        ageRangeCode: socio.codigo_faixa_etaria,
        entryDate: socio.data_entrada_sociedade,
        partnerId: socio.identificador_de_socio,
        legalRepresentativeCpf: socio.cpf_representante_legal,
        legalRepresentativeName: socio.nome_representante_legal,
        partnerQualificationId: socio.codigo_qualificacao_socio,
        legalRepresentativeQualification: socio.qualificacao_representante_legal,
        legalRepresentativeQualificationId: socio.codigo_qualificacao_representante_legal,
      })),
      cnpj: rawCnpjData.cnpj,
      country: rawCnpjData.pais,
      email: rawCnpjData.email,
      companySize: rawCnpjData.porte,
      neighborhood: rawCnpjData.bairro,
      number: rawCnpjData.numero,
      dddFax: rawCnpjData.ddd_fax,
      city: rawCnpjData.municipio,
      address: rawCnpjData.logradouro,
      cnaeTax: rawCnpjData.cnae_fiscal,
      countryId: rawCnpjData.codigo_pais,
      complement: rawCnpjData.complemento,
      companySizeId: rawCnpjData.codigo_porte,
      companyName: rawCnpjData.razao_social,
      fantasyName: rawCnpjData.nome_fantasia,
      socialCapital: rawCnpjData.capital_social,
      dddPhone1: rawCnpjData.ddd_telefone_1,
      dddPhone2: rawCnpjData.ddd_telefone_2,
      mei: rawCnpjData.opcao_pelo_mei,
      cityId: rawCnpjData.codigo_municipio,
      secondaryCnae: rawCnpjData.cnaes_secundarios?.map((cnae) => ({
        code: cnae.codigo,
        description: cnae.descricao,
      })),
      legalNature: rawCnpjData.natureza_juridica,
      taxRegime: rawCnpjData.regime_tributario.map((regime) => ({
        year: regime.ano,
        scpCnpj: regime.cnpj_da_scp,
        taxForm: regime.forma_de_tributacao,
        bookkeepingNumber: regime.quantidade_de_escrituracoes,
      })),
      specialSituation: rawCnpjData.situacao_especial,
      simples: rawCnpjData.opcao_pelo_simples ?? false,
      registrationStatus: rawCnpjData.situacao_cadastral,
      meiOptionDate: new Date(rawCnpjData.data_opcao_pelo_mei!),
      meiExcludedDate: rawCnpjData.data_exclusao_do_mei,
      cnaeDescription: rawCnpjData.cnae_fiscal_descricao,
      ibgeCityId: rawCnpjData.codigo_municipio_ibge,
      startDate: new Date(rawCnpjData.data_inicio_atividade),
      specialSituationDate: new Date(rawCnpjData.data_situacao_especial!),
      simplesOptionDate: rawCnpjData.data_opcao_pelo_simples,
      registrationStatusDate: rawCnpjData.data_situacao_cadastral,
      exteriorCityName: rawCnpjData.nome_cidade_no_exterior,
      legalNatureId: rawCnpjData.codigo_natureza_juridica,
      simplesExcludedDate: new Date(rawCnpjData.data_exclusao_do_simples!),
      reasonForRegistrationStatus: rawCnpjData.motivo_situacao_cadastral,
      responsibleFederativeEntity: rawCnpjData.ente_federativo_responsavel,
      branchMatrixIdentifier: rawCnpjData.identificador_matriz_filial,
      responsableQualification: rawCnpjData.qualificacao_do_responsavel,
      descriptionRegistrationStatus: rawCnpjData.descricao_situacao_cadastral,
      addressTypeDescription: rawCnpjData.descricao_tipo_de_logradouro,
      descriptionReasonRegistrationStatus: rawCnpjData.descricao_motivo_situacao_cadastral,
      descriptionIdentifierBranchMatrix: rawCnpjData.descricao_identificador_matriz_filial,
    };

    return cnpjData;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError('Tempo limite excedido ao buscar o banco');
    }

    if (error instanceof AppError) {
      throw error;
    }
    {
      throw new ServerError('Erro ao buscar o banco pelo código');
    }
  }
}

type RawCnpj = {
  uf: Uf;
  cep: string;
  qsa: Array<{
    pais?: string;
    nome_socio: string;
    codigo_pais?: string;
    faixa_etaria: AgeRange;
    cnpj_cpf_do_socio: string;
    qualificacao_socio: string;
    codigo_faixa_etaria: number;
    data_entrada_sociedade: Date;
    identificador_de_socio: number;
    cpf_representante_legal: string;
    nome_representante_legal: string;
    codigo_qualificacao_socio: number;
    qualificacao_representante_legal: string;
    codigo_qualificacao_representante_legal: number;
  }>;
  cnpj: string;
  pais?: string;
  email?: string;
  porte: CompanySize;
  bairro: string;
  numero: string;
  ddd_fax: string;
  municipio: string;
  logradouro: string;
  cnae_fiscal: number;
  codigo_pais?: number;
  complemento: string;
  codigo_porte: number;
  razao_social: string;
  nome_fantasia: string;
  capital_social: number;
  ddd_telefone_1: string;
  ddd_telefone_2: string;
  opcao_pelo_mei: boolean;
  codigo_municipio: number;
  cnaes_secundarios?: Array<{
    codigo: string;
    descricao: string;
  }>;
  natureza_juridica: string;
  regime_tributario: Array<{
    ano: number;
    cnpj_da_scp?: string;
    forma_de_tributacao: string;
    quantidade_de_escrituracoes: number;
  }>;
  situacao_especial: string;
  opcao_pelo_simples?: boolean;
  situacao_cadastral: number;
  data_opcao_pelo_mei?: Date;
  data_exclusao_do_mei?: Date;
  cnae_fiscal_descricao: string;
  codigo_municipio_ibge: number;
  data_inicio_atividade: Date;
  data_situacao_especial?: Date;
  data_opcao_pelo_simples?: Date;
  data_situacao_cadastral?: Date;
  nome_cidade_no_exterior: string;
  codigo_natureza_juridica: number;
  data_exclusao_do_simples?: Date;
  motivo_situacao_cadastral: number;
  ente_federativo_responsavel: string;
  identificador_matriz_filial: number;
  qualificacao_do_responsavel: number;
  descricao_situacao_cadastral: string;
  descricao_tipo_de_logradouro: string;
  descricao_motivo_situacao_cadastral: string;
  descricao_identificador_matriz_filial: string;
};

export { getCnpj };
