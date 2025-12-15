import { bookDimensions } from './bookDimensions';
import { IsbnProviders } from './isbnProviders';

interface bookInfo {
  isbn: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  publisher: string;
  sinopsis: string;
  dimensions: bookDimensions | null;
  year: number;
  format: string;
  pageCount: number;
  subjects: string[];
  location: string;
  retail_price: number | null;
  cover_url: string | null;
  provider: IsbnProviders;
}

export { bookInfo };
