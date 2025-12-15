import { getBookByIsbn, IsbnProviders } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('get book by isbn - integration', () => {
  it('should return book data for a given isbn', async () => {
    const book = await getBookByIsbn('978-8535908343', [IsbnProviders.OPEN_LIBRARY]);

    expect(book).toHaveProperty('isbn', '9788535908343');
    expect(book).toHaveProperty('title', 'Um mundo assombrado pelos demônios');
    expect(book).toHaveProperty('authors');
    expect(book.authors).toEqual(['Carl Sagan']);
    expect(book).toHaveProperty('publisher', 'Companhia de Bolso');
    expect(book).toHaveProperty('year', 2006);
    expect(book).toHaveProperty('page_count', 512);
    expect(book).toHaveProperty('subjects');
    expect(book).toHaveProperty('cover_url', 'https://covers.openlibrary.org/b/id/13318322-L.jpg');
    expect(book).toHaveProperty('provider', 'open-library');
  });
});
