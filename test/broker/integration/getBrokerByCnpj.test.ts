import { getBrokerByCnpj } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('getBrokerByCnpj', () => {
  it('must return a broker when given a valid CNPJ', async () => {
    const result = await getBrokerByCnpj('023-328-860-00/104');
    expect(result).toBeDefined();

    expect(result).toHaveProperty('cnpj', '02332886000104');
    expect(result).toHaveProperty('socialName');
    expect(result).toHaveProperty('comercialName');
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('phone');
    expect(result).toHaveProperty('cep');
    expect(result).toHaveProperty('country');
    expect(result).toHaveProperty('uf');
    expect(result).toHaveProperty('city');
    expect(result).toHaveProperty('neighborhood');
    expect(result).toHaveProperty('complement');
    expect(result).toHaveProperty('address');
    expect(result).toHaveProperty('netEquityDate');
    expect(result).toHaveProperty('netEquityValue');
    expect(result).toHaveProperty('cvmCode');
    expect(result).toHaveProperty('situationStartDate');
    expect(result).toHaveProperty('registrationDate');
  });
});
