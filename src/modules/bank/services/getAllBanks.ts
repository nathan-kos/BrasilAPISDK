import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeOutError';
import { Bank } from '../entities/Bank';

async function getAllBanks(): Promise<Bank[]> {
  const url = `${getBaseUrl()}/banks/v1`;

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

    const banksData = (await response.json()) as Bank[];

    return banksData;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError('Tempo limite excedido ao buscar todos os bancos');
    }
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new ServerError('Erro ao buscar todos os bancos');
    }
  }
}

export { getAllBanks };
