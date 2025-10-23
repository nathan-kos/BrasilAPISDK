import { Uf } from '@src/shared/enums/uf';
import { Wave } from './wave';

interface MarineWeather {
  city: string;
  uf: Uf;
  updatedAt: Date;
  waves: Wave[];
}

export { MarineWeather };
