import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { BadRequestError } from '@src/shared/exceptions/BadRequestError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { bookInfo } from '../entities/bookInfo';
import { IsbnProviders } from '../entities/isbnProviders';

async function getBookByIsbn(isbn: string, provider?: IsbnProviders[]): Promise<bookInfo> {
  const clearedIsbn = isbn.replace(/[^0-9X]/gi, '');

  if (clearedIsbn.length !== 10 && clearedIsbn.length !== 13) {
    throw new BadRequestError('Invalid ISBN. It must be 10 or 13 characters long.');
  }

  const url = `${getBaseUrl()}/isbn/v1/${clearedIsbn}`;

  if (provider && provider.length > 0) {
    const providersParam = provider.join(',');
    url.concat(`?provider=${providersParam}`);
  }

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

    const book = (await response.json()) as bookInfo;

    return book;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError('timeout fetching book data by ISBN');
    }
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new ServerError('Error fetching book data by ISBN');
    }
  }
}

export { getBookByIsbn };
