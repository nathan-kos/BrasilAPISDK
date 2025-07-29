import { CurrencySymbol } from '@src/modules/currency/entities/CurrencySymbol';
import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { BadRequestError } from '@src/shared/exceptions/BadRequestError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { DateUtils } from '@src/shared/utils/date';
import { BulletinType } from '../entities/BulletinType';
import { Exchange } from '../entities/Exchange';

async function GetExchangeByCurrencyAndDate(
  currency: CurrencySymbol,
  date: Date,
): Promise<Exchange> {
  if (!DateUtils.isValidDate(date)) {
    throw new BadRequestError('Invalid date provided');
  }

  const formatDate = DateUtils.formatDate(date);

  if (!DateUtils.isAfterDate(formatDate, new Date('1984-11-28T00:00:00'))) {
    throw new BadRequestError('Date must be after 28/11/1984');
  }

  const url = `${getBaseUrl()}/cambio/v1/cotacao/${currency}/${formatDate}`;

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

    type RawBulletin = {
      paridade_compra: number;
      paridade_venda: number;
      cotacao_compra: number;
      cotacao_venda: number;
      data_hora_cotacao: string;
      tipo_boletim: string;
    };

    type RawExchange = {
      cotacoes: RawBulletin[];
      moeda: string;
      data: string;
    };

    const exchangeData = (await response.json()) as RawExchange;

    console.log('Exchange Data:', exchangeData);

    if (!exchangeData || !exchangeData.cotacoes || exchangeData.cotacoes.length === 0) {
      throw new BadRequestError('No exchange data found for the given currency and date');
    }

    const bulletins = exchangeData.cotacoes.map((bulletin) => ({
      buyParity: bulletin.paridade_compra,
      sellParity: bulletin.paridade_venda,
      buyRate: bulletin.cotacao_compra,
      sellRate: bulletin.cotacao_venda,
      timestamp: new Date(bulletin.data_hora_cotacao),
      type: bulletin.tipo_boletim as BulletinType,
    }));

    const exchange: Exchange = {
      bulletins,
      date: exchangeData.data,
      currency: exchangeData.moeda as CurrencySymbol,
    };

    return exchange;
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

export { GetExchangeByCurrencyAndDate };
