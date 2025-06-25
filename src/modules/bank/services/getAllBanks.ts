import { getBaseUrl } from '@src/shared/config/ApiConfig';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { Bank } from '../entities/Bank';

async function getAllBanks(): Promise<Bank[]> {
  const url = `${getBaseUrl()}/banks/v1`;

  const response = await fetch(url);

  if (!response.ok) {
    await handleResponseError(response);
  }

  const banksData = (await response.json()) as Bank[];

  return banksData;
}

export { getAllBanks };
