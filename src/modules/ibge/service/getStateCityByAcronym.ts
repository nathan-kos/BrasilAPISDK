import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { Uf } from '@src/shared/enums/uf';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { IbgeCity } from '../entities/city';

async function getStateCityByAcronym(acronym: Uf): Promise<IbgeCity[]> {
  const url = `${getBaseUrl()}/ibge/municipios/v1/${acronym}`;

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

    const rawCities = (await response.json()) as RawIbgeCity[];

    const cities: IbgeCity[] = rawCities.map((item) => ({
      name: item.nome,
      ibgeCode: item.codigo_ibge,
    }));

    return cities;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError('');
    }
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new ServerError('Error fetching exchange data for the given currency and date');
    }
  }
}

export { getStateCityByAcronym };

type RawIbgeCity = {
  nome: string;
  codigo_ibge: string;
};
