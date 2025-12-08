import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { FipeTable } from '../entities/fipeTable';

async function getFipeTables(): Promise<FipeTable[]> {
  const url = `${getBaseUrl()}/fipe/tabelas/v1`;

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

    const fipeTables = (await response.json()) as rawTable[];

    const tableData: FipeTable[] = fipeTables.map((table) => ({
      id: table.codigo,
      month: table.mes,
    }));

    return tableData;
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

export { getFipeTables };

type rawTable = {
  codigo: number;
  mes: string;
};
