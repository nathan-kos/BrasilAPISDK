import { getBaseUrl } from '@src/shared/config/ApiConfig';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { Bank } from '../entities/Bank';

async function getBankByCode(bankCode: string): Promise<Bank> {
  const url = `${getBaseUrl()}/banks/v1/${bankCode}`;

  const response = await fetch(url);

  if (!response.ok) {
    await handleResponseError(response);
  }

  const bankData = (await response.json()) as Bank;

  return bankData;
}

export { getBankByCode };
