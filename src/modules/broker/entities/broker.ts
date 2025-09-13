import { Uf } from '@src/shared/enums/uf';
import { BrokerStatus } from './brokerstatus';

interface Broker {
  cnpj: string;
  type: string;
  socialName: string;
  comercialName: string;
  status: BrokerStatus;
  email: string;
  phone: string;
  cep: string;
  country: string;
  uf: Uf;
  city: string;
  neighborhood: string;
  complement?: string;
  address: string;
  netEquityDate: Date;
  netEquityValue: number;
  cvmCode: string;
  situationStartDate: Date;
  registrationDate: Date;
}

export { Broker };
