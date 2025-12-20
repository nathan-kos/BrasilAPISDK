import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { VehicleModel } from '../entities/vehicleModel';
import { VehicleType } from '../entities/vehicleType';

async function getBrandsVehicleModel(
  type: VehicleType,
  brand: number,
): Promise<Promise<Promise<VehicleModel[]>>> {
  const url = `${getBaseUrl()}/fipe/veiculos/v1/${type}/${brand}`;

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

    const rawModels: { modelo: string }[] = (await response.json()) as { modelo: string }[];

    return rawModels.map((model) => ({
      model: model.modelo,
    }));
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError('Tempo limite excedido ao buscar o banco');
    }

    if (error instanceof AppError) {
      throw error;
    }
    {
      throw new ServerError('Erro ao buscar o banco pelo código');
    }
  }
}

export { getBrandsVehicleModel };
