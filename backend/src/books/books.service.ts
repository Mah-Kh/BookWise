import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { BooksRepository } from './repositories/books.repository.js';
import { OpenLibraryService } from './open-library.service.js';
import { BookIngestionService } from './book-ingestion.service.js';

@Injectable()
export class BooksService {
  constructor(
    private readonly booksRepository: BooksRepository,
    private readonly openLibraryService: OpenLibraryService,
    private readonly bookIngestionService: BookIngestionService,
  ) {}

  async getBooks() {
    return this.booksRepository.findAll();
  }

  async getBook(id: number) {
    const book = await this.booksRepository.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async create(createBookDto: CreateBookDto) {
    const externalId = createBookDto.externalId;

    if (externalId) {
      const existingBook =
        await this.booksRepository.findByExternalId(externalId);

      if (existingBook) {
        return existingBook;
      }
    }

    return this.booksRepository.create(createBookDto.title, externalId);
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto) {
    if (updateBookDto.title === undefined) {
      throw new BadRequestException('No fields to update');
    }

    const book = await this.booksRepository.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return this.booksRepository.update(id, {
      title: updateBookDto.title,
    });
  }

  async deleteBook(id: number) {
    const book = await this.booksRepository.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    await this.booksRepository.delete(id);

    return { message: 'Book deleted successfully' };
  }

  async searchExternalBooks(query: string) {
    return this.openLibraryService.search(query);
  }

  async ingestBook(id: number) {
    return this.bookIngestionService.ingest(id);
  }
}
