import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { Uf } from '@src/shared/enums/uf';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { Broker } from '../entities/broker';
import { BrokerStatus } from '../entities/brokerstatus';

async function getBrokerByCnpj(cnpj: string): Promise<Broker> {
  const cleanedCnpj = cnpj.replace(/\D/g, '');

  const url = `${getBaseUrl()}/cvm/corretoras/v1/${cleanedCnpj}`;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(getTimeout()) });

    if (!response.ok) {
      await handleResponseError(response);
    }

    const item: RawBroker = (await response.json()) as RawBroker;

    const broker: Broker = {
      cnpj: item.cnpj,
      type: item.type,
      socialName: item.nome_social,
      comercialName: item.nome_comercial,
      status: item.status,
      email: item.email,
      phone: item.telefone,
      cep: item.cep,
      country: item.pais,
      uf: item.uf,
      city: item.municipio,
      neighborhood: item.bairro,
      complement: item.complemento,
      address: item.logradouro,
      netEquityDate: new Date(item.data_patrimonio_liquido),
      netEquityValue: item.valor_patrimonio_liquido,
      cvmCode: item.codigo_cvm,
      situationStartDate: new Date(item.data_inicio_situacao),
      registrationDate: new Date(item.data_registro),
    };

    return broker;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error('Tempo limite excedido ao buscar corretora pelo CNPJ');
    }

    if (error instanceof AppError) {
      throw error;
    } else {
      throw new ServerError('Erro ao buscar corretora pelo CNPJ');
    }
  }
}

export { getBrokerByCnpj };

type RawBroker = {
  cnpj: string;
  type: string;
  nome_social: string;
  nome_comercial: string;
  status: BrokerStatus;
  email: string;
  telefone: string;
  cep: string;
  pais: string;
  uf: Uf;
  municipio: string;
  bairro: string;
  complemento?: string;
  logradouro: string;
  data_patrimonio_liquido: string;
  valor_patrimonio_liquido: number;
  codigo_cvm: string;
  data_inicio_situacao: string;
  data_registro: string;
};
