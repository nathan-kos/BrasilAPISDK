import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { Uf } from '@src/shared/enums/uf';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { State } from '../entities/state';

async function getStateData(): Promise<State[]> {
  const url = `${getBaseUrl()}/ibge/uf/v1`;

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

    const rawStates = (await response.json()) as RawState[];

    const states: State[] = rawStates.map((item) => ({
      id: item.id,
      acronym: item.sigla as Uf,
      name: item.nome,
      region: {
        id: item.regiao.id,
        acronym: item.regiao.sigla,
        name: item.regiao.nome,
      },
    }));

    return states;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError('Request timed out while fetching state data');
    }
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new ServerError('Error fetching exchange data for the given currency and date');
    }
  }
}

export { getStateData };

type RawState = {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
};
