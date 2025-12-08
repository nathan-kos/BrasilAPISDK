import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { FipeVehicleData } from '../entities/fipeVehicleData';

async function getFipeVehicleDataByCode(
  code: string,
  referenceTable?: string,
): Promise<FipeVehicleData[]> {
  let url = `${getBaseUrl()}/fipe/preco/v1/${code}`;

  code = code.replace('-', '');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), getTimeout());

    if (referenceTable) {
      url += `?tabela_referencia=${referenceTable}`;
    }

    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleResponseError(response);
    }

    const rawFipeVehicleData = (await response.json()) as rawFipeVehicleData[];

    const fipeVehicleData: FipeVehicleData[] = rawFipeVehicleData.map((data) => ({
      brand: data.marca,
      model: data.modelo,
      fuel: data.combustivel,
      fipeCode: data.codigoFipe,
      referenceMonth: data.mesReferencia.trim(),
      vehicleType: data.tipoVeiculo,
      fuelAcronym: data.siglaCombustivel,
      price: data.valor,
      consultationDate: data.dataConsulta,
      value: data.valor,
      year: data.anoModelo,
    }));

    return fipeVehicleData;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError('Tempo limite excedido ao buscar todas as cidades');
    }
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new ServerError('Erro ao buscar todas as cidades');
    }
  }
}

export { getFipeVehicleDataByCode };

type rawFipeVehicleData = {
  valor: string;
  marca: string;
  modelo: string;
  anoModelo: number;
  combustivel: string;
  codigoFipe: string;
  mesReferencia: string;
  tipoVeiculo: number;
  siglaCombustivel: string;
  dataConsulta: string;
};
