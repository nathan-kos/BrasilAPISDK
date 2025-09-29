import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { Uf } from '@src/shared/enums/uf';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { City } from '../entities/city';

async function listCities(): Promise<City[]> {
  const url = `${getBaseUrl()}/cptec/v1/cidade`;

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

    const locations = (await response.json()) as rawCity[];

    const mappedLocations = locations.map((loc) => ({
      name: loc.nome,
      id: loc.id.toString(),
      uf: loc.estado as Uf,
    }));

    return mappedLocations;
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

export { listCities };

type rawCity = {
  nome: string;
  id: number;
  estado: string;
};
