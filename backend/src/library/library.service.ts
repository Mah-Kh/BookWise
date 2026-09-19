import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { BooksRepository } from '../books/repositories/books.repository.js';
import { LibraryRepository } from './repositories/library.repository.js';
import { ReadingStatus } from '../generated/prisma/enums.js';
import { BookIngestionService } from '../books/book-ingestion.service.js';

@Injectable()
export class LibraryService {
  constructor(
    private readonly libraryRepository: LibraryRepository,
    private readonly booksRepository: BooksRepository,
    private readonly bookIngestionService: BookIngestionService,
  ) {}

  async getLibrary(userId: number) {
    return this.libraryRepository.findByUser(userId);
  }

  async addBook(userId: number, bookId: number) {
    const book = await this.booksRepository.findById(bookId);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const existing = await this.libraryRepository.findByUserAndBook(
      userId,
      bookId,
    );

    if (existing) {
      throw new ConflictException('Book already exists in library');
    }

    const userBook = await this.libraryRepository.create(userId, bookId);

    // Start book ingestion for newly added books.
    // Library addition itself should remain successful if ingestion fails.
    try {
      await this.bookIngestionService.ingest(bookId);
    } catch (error) {
      console.error(`Failed to ingest book ${bookId}:`, error);
    }

    return userBook;
  }

  async removeBook(userId: number, bookId: number) {
    const existing = await this.libraryRepository.findByUserAndBook(
      userId,
      bookId,
    );

    if (!existing) {
      throw new NotFoundException('Book not found in library');
    }

    await this.libraryRepository.delete(userId, bookId);

    return {
      message: 'Book removed from library',
    };
  }

  async updateStatus(userId: number, bookId: number, status: ReadingStatus) {
    const existing = await this.libraryRepository.findByUserAndBook(
      userId,
      bookId,
    );

    if (!existing) {
      throw new NotFoundException('Book not found in library');
    }

    return this.libraryRepository.updateStatus(userId, bookId, status);
  }

  async updateFavorite(userId: number, bookId: number, isFavorite: boolean) {
    const existing = await this.libraryRepository.findByUserAndBook(
      userId,
      bookId,
    );

    if (!existing) {
      throw new NotFoundException('Book not found in library');
    }

    return this.libraryRepository.updateFavorite(userId, bookId, isFavorite);
  }
}
