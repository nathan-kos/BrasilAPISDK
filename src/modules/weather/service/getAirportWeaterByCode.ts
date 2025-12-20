import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { normalizer } from '@src/shared/utils/string/normalizer';
import { Weather } from '../entitie/weather';

async function getAirportWeaterByCode(icaoCode: string): Promise<Weather> {
  const url = `${getBaseUrl()}/cptec/v1/clima/aeroporto/${icaoCode}`;

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

    const w = (await response.json()) as rawWeather;

    const weather: Weather = {
      ICAOCode: w.codigo_icao,
      updatedAt: new Date(w.atualizado_em),
      atmosphericPressure: normalizer(w.pressao_atmosferica),
      visibility: normalizer(w.visibilidade),
      wind: normalizer(w.vento),
      windDirection: normalizer(w.direcao_vento),
      humidity: normalizer(w.umidade),
      condition: w.condicao,
      conditionDescription: w.condicao_desc,
      temperature: normalizer(w.temp),
    };

    return weather;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error('Tempo limite excedido');
    }

    if (error instanceof AppError) {
      throw new Error('Erro ao buscar o clima do aeroporto');
    } else {
      throw new ServerError('Erro ao buscar o clima do aeroporto');
    }
  }
}

export { getAirportWeaterByCode };

type rawWeather = {
  codigo_icao: string;
  atualizado_em: string;
  pressao_atmosferica: string;
  visibilidade: string;
  vento: string;
  direcao_vento: string;
  umidade: string;
  condicao: string;
  condicao_desc: string;
  temp: string;
};
