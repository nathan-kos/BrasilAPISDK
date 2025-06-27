import { getBaseUrl } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { Bank } from '../entities/Bank';

async function getBankByCode(bankCode: string): Promise<Bank> {
  const url = `${getBaseUrl()}/banks/v1/${bankCode}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      await handleResponseError(response);
    }

    const bankData = (await response.json()) as Bank;

    return bankData;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    {
      throw new ServerError('Erro ao buscar o banco pelo código');
    }
  }
}

export { getBankByCode };
