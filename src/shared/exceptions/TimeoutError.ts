import { AppError } from './AppError';

class TimeoutError extends AppError {
  constructor(message: string = 'Timeout Error') {
    super(message, 408);
  }
}

export { TimeoutError };
