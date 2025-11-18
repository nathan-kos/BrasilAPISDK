import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { FipeBrand } from '../entities/fipeBrand';
import { VehicleType } from '../entities/vehicleType';

async function getBrandByVehicleType(vehicleType: VehicleType): Promise<FipeBrand[]> {
  const url = `${getBaseUrl()}/fipe/marcas/v1/${vehicleType}`;

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

    const Rawbrands = (await response.json()) as rawBrand[];

    const brands: FipeBrand[] = Rawbrands.map((brand) => ({
      name: brand.nome,
      id: brand.valor,
    }));

    return brands;
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

export { getBrandByVehicleType };

type rawBrand = {
  nome: string;
  valor: string;
};
