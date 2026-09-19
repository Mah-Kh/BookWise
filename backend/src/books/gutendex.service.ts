import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

type GutendexBook = {
  id: number;
  title: string;
  formats: Record<string, string>;
};

type GutendexResponse = {
  results: GutendexBook[];
};

@Injectable()
export class GutendexService {
  constructor(private readonly httpService: HttpService) {}

  private getTextUrl(book: GutendexBook): string | null {
    const exact =
      book.formats['text/plain; charset=utf-8'] ?? book.formats['text/plain'];

    if (exact) {
      return exact;
    }

    const plainTextKey = Object.keys(book.formats).find((key) =>
      key.toLowerCase().startsWith('text/plain'),
    );

    return plainTextKey ? book.formats[plainTextKey] : null;
  }

  async findByTitle(title: string) {
    const response = await firstValueFrom(
      this.httpService.get<GutendexResponse>('https://gutendex.com/books', {
        params: {
          search: title,
        },
      }),
    );

    const books = response.data.results;

    if (books.length === 0) {
      throw new NotFoundException('Book text not found');
    }

    const normalizedTitle = title.trim().toLowerCase();

    const exactMatch = books.find(
      (book) => book.title.trim().toLowerCase() === normalizedTitle,
    );

    if (exactMatch && this.getTextUrl(exactMatch)) {
      return exactMatch;
    }

    const exactMatchWithText = books.find(
      (book) =>
        book.title.trim().toLowerCase() === normalizedTitle &&
        this.getTextUrl(book) !== null,
    );

    if (exactMatchWithText) {
      return exactMatchWithText;
    }

    const anyBookWithText = books.find(
      (book) => this.getTextUrl(book) !== null,
    );

    if (anyBookWithText) {
      return anyBookWithText;
    }

    throw new NotFoundException(
      `No downloadable plain-text version found for "${title}"`,
    );
  }

  async getText(book: GutendexBook) {
    const textUrl = this.getTextUrl(book);

    if (!textUrl) {
      throw new NotFoundException('Plain text format not available');
    }

    const response = await firstValueFrom(
      this.httpService.get<string>(textUrl, {
        responseType: 'text',
      }),
    );

    return {
      externalId: String(book.id),
      text: response.data,
    };
  }
}
