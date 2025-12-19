/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DomainInfo, getDomainInfo } from '@src/index';
import { DomainStatus } from '@src/modules/domain/entities/domainStatus';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get domain info - unit', () => {
  it('should fetch available domain info successfully', async () => {
    const domain = 'kjsdlkowpkdfjo';

    const rawDomainInfo: rawDomainInfo = {
      status_code: 0,
      status: 'AVAILABLE',
      fqdn: 'kjsdlkowpkdfjo.com.br',
      fqdnace: '',
      exempt: false,
    };

    const domainInfoResponse: DomainInfo = {
      statusCode: 0,
      status: DomainStatus.AVAILABLE,
      fqdn: 'kjsdlkowpkdfjo.com.br',
      fqdnace: '',
      exempt: false,
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawDomainInfo),
    });

    global.fetch = mockFetch;

    const domainInfo = await getDomainInfo(domain);

    expect(domainInfo).toEqual(domainInfoResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('registrobr/v1/kjsdlkowpkdfjo'),
      {
        signal: expect.any(AbortSignal),
      },
    );
  });

  it('should fetch unavailable domain info successfully', async () => {
    const domain = 'exemple.com.br';

    const rawDomainInfo: rawDomainInfo = {
      status_code: 3,
      status: 'UNAVAILABLE',
      fqdn: 'exemple.com.br',
      fqdnace: '',
      exempt: false,
      suggestions: ['example1.com.br', 'example2.com.br'],
      reasons: ['Already registered', 'Not available'],
    };

    const domainInfoResponse: DomainInfo = {
      statusCode: 3,
      status: DomainStatus.UNAVAILABLE,
      fqdn: 'exemple.com.br',
      fqdnace: '',
      exempt: false,
      suggestion: ['example1.com.br', 'example2.com.br'],
      reason: ['Already registered', 'Not available'],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawDomainInfo),
    });

    global.fetch = mockFetch;

    const domainInfo = await getDomainInfo(domain);

    expect(domainInfo).toEqual(domainInfoResponse);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('registrobr/v1/exemple'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should fetch registered domain info successfully', async () => {
    const domain = 'nathanks';

    const rawDomainInfo: rawDomainInfo = {
      status_code: 2,
      status: 'REGISTERED',
      fqdn: 'nathanks.com.br',
      fqdnace: '',
      exempt: false,
      host: ['ns1.example.com', 'ns2.example.com'],
      'publication-status': 'published',
      'expiry-at': '2025-12-31',
      suggestions: ['nathanks1.com.br', 'nathanks2.com.br'],
    };

    const domainInfoResponse: DomainInfo = {
      statusCode: 2,
      status: DomainStatus.REGISTERED,
      fqdn: 'nathanks.com.br',
      fqdnace: '',
      exempt: false,
      host: ['ns1.example.com', 'ns2.example.com'],
      publicationStatus: 'published',
      expiryDate: '2025-12-31',
      suggestion: ['nathanks1.com.br', 'nathanks2.com.br'],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawDomainInfo),
    });

    global.fetch = mockFetch;

    const domainInfo = await getDomainInfo(domain);

    expect(domainInfo).toEqual(domainInfoResponse);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('registrobr/v1/nathanks'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getDomainInfo('example')).rejects.toBeInstanceOf(TimeoutError);
  });

  it('should throw an error if the response status is 400 (bad request)', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Bad Request' }),
    });

    global.fetch = mockFetch;

    await expect(getDomainInfo('invalid_domain')).rejects.toThrow('Bad Request');
  });
});

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
