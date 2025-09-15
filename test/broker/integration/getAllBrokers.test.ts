import { getAllBrokers } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('getAllBrokers', () => {
  it('must return a list of brokers with expected properties', async () => {
    const brokers = await getAllBrokers();

    expect(Array.isArray(brokers)).toBe(true);
    expect(brokers.length).toBeGreaterThan(0);

    const sample = brokers[0];
    expect(sample).toHaveProperty('cnpj');
    expect(sample).toHaveProperty('type');
    expect(sample).toHaveProperty('socialName');
    expect(sample).toHaveProperty('comercialName');
    expect(sample).toHaveProperty('status');
    expect(sample).toHaveProperty('email');
    expect(sample).toHaveProperty('phone');
    expect(sample).toHaveProperty('cep');
    expect(sample).toHaveProperty('country');
    expect(sample).toHaveProperty('uf');
    expect(sample).toHaveProperty('city');
    expect(sample).toHaveProperty('neighborhood');
    expect(sample).toHaveProperty('complement');
    expect(sample).toHaveProperty('address');
    expect(sample).toHaveProperty('netEquityDate');
    expect(sample).toHaveProperty('netEquityValue');
    expect(sample).toHaveProperty('cvmCode');
    expect(sample).toHaveProperty('situationStartDate');
    expect(sample).toHaveProperty('registrationDate');
  });
});
