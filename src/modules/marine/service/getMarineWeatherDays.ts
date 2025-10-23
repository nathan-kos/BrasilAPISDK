import { getBaseUrl } from '@src/shared/config/ApiConfig';
import { Uf } from '@src/shared/enums/uf';
import { AppError } from '@src/shared/exceptions/AppError';
import { BadRequestError } from '@src/shared/exceptions/BadRequestError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { normalizer } from '@src/shared/utils/string/normalizer';
import { Direction } from '../entitie/directions';
import { MarineWeather } from '../entitie/marineWeather';
import { Wave } from '../entitie/wave';

async function getMarineWeatherDays(code: number, dayNumbers: number): Promise<MarineWeather> {
  const url = `${getBaseUrl()}/cptec/v1/ondas/${code}/${dayNumbers}`;

  if (dayNumbers < 1 || dayNumbers > 6) {
    throw new BadRequestError('O número de dias deve ser entre 1 e 6');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleResponseError(response);
    }

    const rawMarineWeather = (await response.json()) as rawMarineWeather;

    const waves: Wave[] = rawMarineWeather.ondas.map((wave) => ({
      date: new Date(wave.data),
      data: wave.dados_ondas.map((dw) => ({
        wind: normalizer(dw.vento.toString()) || '0',
        windDirection: dw.direcao_vento as Direction,
        windDirectionDesc: normalizer(dw.direcao_vento_desc) || 'N/A',
        waveHeight: normalizer(dw.altura_onda.toString()) || '0',
        waveDirection: dw.direcao_onda as Direction,
        waveDirectionDesc: normalizer(dw.direcao_onda_desc) || 'N/A',
        agitation: dw.agitation,
        time: dw.hora,
      })),
    }));

    const marineWeather: MarineWeather = {
      city: rawMarineWeather.cidade,
      uf: rawMarineWeather.estado as Uf,
      updatedAt: new Date(rawMarineWeather.atualizado_em),
      waves,
    };

    return marineWeather;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error('Tempo limite excedido');
    }

    if (error instanceof AppError) {
      throw new Error('Erro ao buscar o clima marinho');
    } else {
      console.log('Erro inesperado:', error);
      throw new ServerError('Erro ao buscar o clima marinho');
    }
  }
}

export { getMarineWeatherDays };

type rawMarineWeather = {
  cidade: string;
  estado: string;
  atualizado_em: string;
  ondas: {
    data: string;
    dados_ondas: {
      vento: number;
      direcao_vento: string;
      direcao_vento_desc: string;
      altura_onda: number;
      direcao_onda: string;
      direcao_onda_desc: string;
      agitation: string;
      hora: string;
    }[];
  }[];
};
