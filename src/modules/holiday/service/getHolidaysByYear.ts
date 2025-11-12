import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { BadRequestError } from '@src/shared/exceptions/BadRequestError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { Holiday } from '../entities/holiday';

async function getHolidaysByYear(year: number): Promise<Holiday[]> {
  if (year < 1900 || year > 2199) {
    throw new BadRequestError('Ano de consulta deve estar entre 1900 e 2199');
  }

  const url = `${getBaseUrl()}/feriados/v1/${year}`;

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

    const data = (await response.json()) as RawHoliday[];

    const holidays: Holiday[] = data.map((item) => ({
      date: new Date(item.date),
      name: item.name,
      type: item.type,
    }));

    return holidays;
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

export { getHolidaysByYear };

type RawHoliday = {
  date: string;
  name: string;
  type: string;
};
