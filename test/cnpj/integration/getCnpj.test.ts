import { getCnpj } from '@src/index';
import { CompanySize } from '@src/modules/cnpj/entities/size';
import { Uf } from '@src/modules/cnpj/entities/uf';
import { describe, expect, it } from 'vitest';

describe('getCnpj', () => {
  it('should return a valid CNPJ with expected properties', async () => {
    const cnpj = await getCnpj('00.000.000/0001-91');

    expect(cnpj).toHaveProperty('cnpj', '00000000000191');
    expect(cnpj).toHaveProperty('companyName');
    expect(cnpj).toHaveProperty('fantasyName');
    expect(cnpj).not.toBeNull();
    expect(cnpj).toHaveProperty('uf');
    expect(Object.values(Uf)).toContain(cnpj.uf);

    expect(cnpj).toHaveProperty('cep');
    expect(typeof cnpj.cep).toBe('string');

    expect(cnpj).toHaveProperty('companySize');
    expect(Object.values(CompanySize)).toContain(cnpj.companySize);

    expect(cnpj).toHaveProperty('registrationStatus');
    expect(typeof cnpj.registrationStatus).toBe('number');

    expect(cnpj).toHaveProperty('startDate');
    expect(cnpj.startDate instanceof Date).toBe(true);

    if (cnpj.qsa) {
      expect(Array.isArray(cnpj.qsa)).toBe(true);
      if (cnpj.qsa.length > 0) {
        expect(cnpj.qsa[0]).toHaveProperty('memberName');
        expect(cnpj.qsa[0]).toHaveProperty('ageRangeCode');
      }
    }
  });
});
