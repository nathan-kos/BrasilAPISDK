import { AppError } from './AppError';
import { BadRequestError } from './BadRequestError';
import { NotFoundError } from './NotFoundError';
import { ServerError } from './ServerError';

async function handleResponseError(response: Response): Promise<never> {
  let message: string | undefined;

  try {
    const data: unknown = await response.json();

    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as Record<string, unknown>).message === 'string'
    ) {
      message = (data as Record<string, unknown>).message as string;
    }
  } catch {
    console.debug('Erro ao processar a resposta JSON.', response);
    message = 'Erro ao processar a resposta do servidor.';
  }

  switch (response.status) {
    case 400:
      throw new BadRequestError(message);
    case 404:
      throw new NotFoundError(message);
    case 500:
      throw new ServerError(message);
    default:
      throw new AppError(message ?? 'Erro inesperado.', response.status);
  }
}

export { handleResponseError };
