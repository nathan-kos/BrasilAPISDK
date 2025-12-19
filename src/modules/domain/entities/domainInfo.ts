import { DomainStatus } from './domainStatus';

interface DomainInfo {
  statusCode: number;
  status: DomainStatus;
  fqdn: string;
  host?: string[];
  publicationStatus?: string;
  expiryDate?: string;
  suggestion?: string[];
  fqdnace: string;
  exempt: boolean;
  reason?: string[];
}

export { DomainInfo };
