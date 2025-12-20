import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { Rate } from '../entities/rate';

async function getAllRate(): Promise<Rate[]> {
  const url = `${getBaseUrl()}/taxas/v1`;

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

    const rates = (await response.json()) as rawRate[];

    return rates.map((rate) => ({
      name: rate.nome,
      value: rate.valor,
    }));
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError('Request timed out while fetching rates data');
    }
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new ServerError('Error fetching tax rates data');
    }
  }
}

export { getAllRate };

type rawRate = {
  nome: string;
  valor: number;
};
