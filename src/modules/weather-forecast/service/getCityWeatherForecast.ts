import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { Uf } from '@src/shared/enums/uf';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { Forecast } from '../entitie/forecast';
import { WeatherForecast } from '../entitie/weatherForecast';
async function getCityWeatherForecast(cityCode: number): Promise<WeatherForecast> {
  const url = `${getBaseUrl()}/cptec/v1/clima/previsao/${cityCode}`;

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

    const weatherData = (await response.json()) as RawWeatherForecast;

    const weather: Forecast[] = weatherData.clima.map((forecast) => ({
      date: new Date(forecast.data),
      condition: forecast.condicao,
      minTemperature: forecast.min,
      maxTemperature: forecast.max,
      UVIndex: forecast.indice_uv,
      conditionDescription: forecast.condicao_desc,
    }));

    return {
      city: weatherData.cidade,
      uf: weatherData.estado as Uf,
      updatedAt: new Date(weatherData.atualizado_em),
      forecast: weather,
    };
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError('Request timed out while fetching exchange data');
    }
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new ServerError('Error fetching exchange data for the given currency and date');
    }
  }
}

export { getCityWeatherForecast };

type RawWeatherForecast = {
  cidade: string;
  estado: string;
  atualizado_em: string;
  clima: [
    {
      data: string;
      condicao: string;
      min: number;
      max: number;
      indice_uv: number;
      condicao_desc: string;
    },
  ];
};
