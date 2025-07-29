import { CurrencySymbol } from '@src/modules/currency/entities/CurrencySymbol';
import { Bulletin } from './Bulletin';

interface Exchange {
  bulletins: Bulletin[];
  date: string;
  currency: CurrencySymbol;
}

export { Exchange };
