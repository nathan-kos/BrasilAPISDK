let baseUrl: string = 'https://brasilapi.com.br/api';
let timeoutMs: number = 5000;

const getBaseUrl = (): string => baseUrl;
const getTimeout = (): number => timeoutMs;

const configure = (options: { baseUrl?: string; timeoutMs?: number }): void => {
  if (options.baseUrl) {
    baseUrl = options.baseUrl;
  }

  if (options.timeoutMs) {
    timeoutMs = options.timeoutMs;
  }
};

export { configure, getBaseUrl, getTimeout };
