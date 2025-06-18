let baseUrl: string = 'https://brasilapi.com.br/api';

const getBaseUrl = (): string => baseUrl;

const configure = (options: { baseUrl: string }): void => {
  if (options.baseUrl) {
    baseUrl = options.baseUrl;
  }
};

export { configure, getBaseUrl };
