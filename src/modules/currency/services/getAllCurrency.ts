import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { Currency } from '../entities/currency';

async function getAllCurrency(): Promise<Currency[]> {
  const url = `${getBaseUrl()}/cambio/v1/moedas`;

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

    type RawCurrency = {
      simbolo: string;
      nome: string;
      tipo_moeda: string;
    };

    const rawData = (await response.json()) as RawCurrency[];

    if (!Array.isArray(rawData)) {
      throw new ServerError('Formato inesperado ao buscar as moedas.');
    }

    const currencyData: Currency[] = rawData.map(({ simbolo, nome, tipo_moeda }) => ({
      symbol: simbolo,
      name: nome,
      type: tipo_moeda,
    }));

    return currencyData;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError('Tempo limite excedido ao buscar todas as moedas');
    }

    if (error instanceof AppError) {
      throw error;
    } else {
      throw new ServerError('Erro ao buscar todas as moedas');
    }
  }
}

export { getAllCurrency };
