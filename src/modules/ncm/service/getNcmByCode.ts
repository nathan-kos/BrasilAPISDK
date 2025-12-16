import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';

async function getNcmByCode(code: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), getTimeout());

    const url = `${getBaseUrl()}/ncm/v1/${code}`;

    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleResponseError(response);
    }

    const ncmData = (await response.json()) as rawNcm;

    const ncm = {
      code: ncmData.codigo,
      description: ncmData.descricao,
      startDate: new Date(ncmData.data_inicio),
      endDate: ncmData.data_fim ? new Date(ncmData.data_fim) : undefined,
      actType: ncmData.tipo_ato,
      actNumber: ncmData.numero_ato,
      actYear: ncmData.ano_ato,
    };

    return ncm;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError('timeout fetching NCM data');
    }
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new ServerError('Error fetching NCM data');
    }
  }
}

export { getNcmByCode };

type rawNcm = {
  codigo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  tipo_ato: string;
  numero_ato: string;
  ano_ato: number;
};
