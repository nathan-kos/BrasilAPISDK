import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { Weather } from '../entitie/weather';

async function getCapitalWeather(): Promise<Weather[]> {
  const url = `${getBaseUrl()}/cptec/v1/clima/capital`;

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

    const rawWeather = (await response.json()) as rawWeather[];

    const weather: Weather[] = rawWeather.map((w) => ({
      ICAOCode: w.codigo_icao,
      updatedAt: new Date(w.atualizado_em),
      atmosphericPressure: w.pressao_atmosferica,
      visibility: w.visibilidade,
      wind: w.vento.toString(),
      windDirection: w.direcao_vento.toString(),
      humidity: w.umidade.toString(),
      condition: w.condicao,
      conditionDescription: w.condicao_Desc,
      temperature: w.temp.toString(),
    }));

    return weather;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error('Tempo limite excedido');
    }

    if (error instanceof AppError) {
      throw new Error('Erro ao buscar o clima da capital');
    } else {
      throw new ServerError('Erro ao buscar o clima da capital');
    }
  }
}

export { getCapitalWeather };

type rawWeather = {
  codigo_icao: string;
  atualizado_em: string;
  pressao_atmosferica: string;
  visibilidade: string;
  vento: string;
  direcao_vento: string;
  umidade: string;
  condicao: string;
  condicao_Desc: string;
  temp: string;
};
