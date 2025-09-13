import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { Uf } from '@src/shared/enums/uf';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { Broker } from '../entities/broker';
import { BrokerStatus } from '../entities/brokerstatus';

async function getAllBrokers(): Promise<Broker[]> {
  const url = `${getBaseUrl()}/cvm/corretoras/v1`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), getTimeout());

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleResponseError(response);
    }

    const data: RawBroker[] = (await response.json()) as RawBroker[];

    const brokers: Broker[] = data.map((item) => ({
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
    }));

    return brokers;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error('Tempo limite excedido ao buscar todas as corretoras');
    }

    if (error instanceof AppError) {
      throw error;
    } else {
      throw new ServerError('Erro ao buscar todas as corretoras');
    }
  }
}

export { getAllBrokers };

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
