import { getDomainInfo } from '@src/index';
import { DomainStatus } from '@src/modules/domain/entities/domainStatus';
import { describe, expect, it } from 'vitest';

describe('get domain info - integration', () => {
  it('should fetch available domain info successfully', async () => {
    const domain = 'kjsdlkowpkdfjo';

    const domainInfo = await getDomainInfo(domain);

    expect(domainInfo).toHaveProperty('statusCode', 0);
    expect(domainInfo).toHaveProperty('status', DomainStatus.AVAILABLE);
    expect(domainInfo).toHaveProperty('fqdn', 'kjsdlkowpkdfjo.com.br');
    expect(domainInfo).toHaveProperty('fqdnace', '');
    expect(domainInfo).toHaveProperty('exempt', false);
  });

  it('should fetch unavailable domain info successfully', async () => {
    const domain = 'exemple.com.br';

    const domainInfo = await getDomainInfo(domain);

    expect(domainInfo).toHaveProperty('statusCode', 3);
    expect(domainInfo).toHaveProperty('status', DomainStatus.UNAVAILABLE);
    expect(domainInfo).toHaveProperty('fqdn', 'exemple.com.br');
    expect(domainInfo).toHaveProperty('fqdnace', '');
    expect(domainInfo).toHaveProperty('exempt', false);
    expect(Array.isArray(domainInfo.suggestion)).toBe(true);
    expect(Array.isArray(domainInfo.reason)).toBe(true);
  });

  it('should fetch registered domain info successfully', async () => {
    const domain = 'nathanks';

    const domainInfo = await getDomainInfo(domain);

    expect(domainInfo).toHaveProperty('statusCode', 2);
    expect(domainInfo).toHaveProperty('status', DomainStatus.REGISTERED);
    expect(domainInfo).toHaveProperty('fqdn', 'nathanks.com.br');
    expect(domainInfo).toHaveProperty('fqdnace', '');
    expect(domainInfo).toHaveProperty('exempt', false);
    expect(Array.isArray(domainInfo.host)).toBe(false);
    expect(domainInfo).toHaveProperty('publicationStatus', 'published');
    expect(domainInfo).toHaveProperty('expiryDate');
    expect(Array.isArray(domainInfo.suggestion)).toBe(true);
  });
});
