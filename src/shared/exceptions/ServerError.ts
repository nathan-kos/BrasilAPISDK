import { AppError } from './AppError';

class ServerError extends AppError {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500);
  }
}

export { ServerError };
