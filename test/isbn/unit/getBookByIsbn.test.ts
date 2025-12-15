/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getBookByIsbn } from '@src/index';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get book by isbn - unit', () => {
  it('should return book data for a given isbn', async () => {
    const rawBook = {
      isbn: '9786525929965',
      title: 'V De Vingança - Edicao Absoluta',
      subtitle: null,
      authors: ['Alan Moore', 'Helcio Carvalho'],
      publisher: 'Panini Comics',
      sinopsis:
        'São 21h00 e esta é a Voz do Destino, transmitindo em ondas médias de 275 a 285 MHz. Cinco de novembro de 1997…',
      dimensions: null,
      year: 2024,
      format: 'physical',
      page_count: 296,
      subjects: ['Quadrinhos', 'Ficção Científica', 'Distopia'],
      location: 'Barueri, SP',
      retail_price: null,
      cover_url: null,
      provider: 'cbl',
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawBook),
    });

    global.fetch = mockFetch;

    const book = await getBookByIsbn('9788576672666');

    expect(book).toEqual(rawBook);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('9788576672666'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getBookByIsbn('9788576672666')).rejects.toBeInstanceOf(TimeoutError);
  });

  it('should throw an error if not found book', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Book not found' }),
    });

    global.fetch = mockFetch;

    await expect(getBookByIsbn('0000000000000')).rejects.toThrow('Book not found');
  });
});
