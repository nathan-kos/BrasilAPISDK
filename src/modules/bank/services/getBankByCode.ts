import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { Bank } from '../entities/Bank';

async function getBankByCode(bankCode: string): Promise<Bank> {
  const url = `${getBaseUrl()}/banks/v1/${bankCode}`;

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

    const bankData = (await response.json()) as Bank;

    return bankData;
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

export { getBankByCode };
