import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { DomainInfo } from '../entities/domainInfo';
import { DomainStatus } from '../entities/domainStatus';

async function getDomainInfo(domain: string): Promise<DomainInfo> {
  const sanitizedDomain = domain
    .replace(/^https?:\/\//, '') // Remove o protocolo
    .split('.')[0] // Pega a parte antes do primeiro ponto
    .toLowerCase()
    .trim(); // Remove espaços em branco

  const url = `${getBaseUrl()}/registrobr/v1/${sanitizedDomain}`;

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

    const rawDomainInfo = (await response.json()) as rawDomainInfo;

    const domainInfo: DomainInfo = {
      statusCode: rawDomainInfo.status_code,
      status: rawDomainInfo.status as DomainStatus,
      fqdn: rawDomainInfo.fqdn,
      fqdnace: rawDomainInfo.fqdnace,
      exempt: rawDomainInfo.exempt,
      host: rawDomainInfo.host,
      publicationStatus: rawDomainInfo['publication-status'],
      expiryDate: rawDomainInfo['expiry-at'],
      suggestion: rawDomainInfo.suggestions,
      reason: rawDomainInfo.reasons,
    };

    return domainInfo;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError('Request timed out while fetching exchange data');
    }
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new ServerError('Error fetching domain info for the given domain');
    }
  }
}

export { getDomainInfo };

type rawDomainInfo = {
  status_code: number;
  status: string;
  fqdn: string;
  fqdnace: string;
  exempt: boolean;
  host?: string[];
  'publication-status'?: string;
  'expiry-at'?: string;
  suggestions?: string[];
  reasons?: string[];
};
