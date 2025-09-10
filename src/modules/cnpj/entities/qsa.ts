import { AgeRange } from './agegroup';

interface Qsa {
  country?: string;
  memberName: string;
  countryCode?: string;
  ageRange: AgeRange;
  cpf_cnpj: string;
  partnerQualification: string;
  ageRangeCode: number;
  entryDate: Date;
  partnerId: number;
  partnerQualificationId: number;

  legalRepresentativeCpf: string;
  legalRepresentativeName: string;
  legalRepresentativeQualification: string;
  legalRepresentativeQualificationId: number;
}

export { Qsa };
