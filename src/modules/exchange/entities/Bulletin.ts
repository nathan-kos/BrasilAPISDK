import { BulletinType } from './BulletinType';

interface Bulletin {
  buyParity: number;
  sellParity: number;
  buyRate: number;
  sellRate: number;
  timestamp: Date;
  type: BulletinType;
}

export { Bulletin };
