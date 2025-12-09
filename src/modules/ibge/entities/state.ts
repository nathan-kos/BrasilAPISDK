import { Uf } from '@src/shared/enums/uf';
import { stateRegion } from './stateRegion';

interface State {
  id: number;
  acronym: Uf;
  name: string;
  region: stateRegion;
}

export { State };
