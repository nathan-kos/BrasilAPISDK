import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';

async function getAllNcm() {
  const url = `${getBaseUrl()}/ncm/v1`;

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

    const ncmData = (await response.json()) as rawNcm[];

    const ncm = ncmData.map((item: rawNcm) => ({
      code: item.codigo,
      description: item.descricao,
      startDate: new Date(item.data_inicio),
      endDate: item.data_fim ? new Date(item.data_fim) : undefined,
      actType: item.tipo_ato,
      actNumber: item.numero_ato,
      actYear: item.ano_ato,
    }));

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

export { getAllNcm };

type rawNcm = {
  codigo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  tipo_ato: string;
  numero_ato: string;
  ano_ato: number;
};
