import { Inject, Injectable } from '@nestjs/common';
import type { Database } from '../prisma/db.js';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('DATABASE')
    private readonly db: Database,
  ) {}

  findLibrary(userId: number) {
    return this.db.userBook.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addBook(userId: number, title: string, externalId: string) {
    const book = await this.db.book.upsert({
      where: { externalId },
      update: { title },
      create: { title, externalId },
    });

    return this.db.userBook.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId: book.id,
        },
      },
      update: {},
      create: {
        userId,
        bookId: book.id,
      },
      include: { book: true },
    });
  }

  updateBook(
    userId: number,
    bookId: number,
    data: {
      status?: 'WANT_TO_READ' | 'READING' | 'COMPLETED';
      isFavorite?: boolean;
    },
  ) {
    return this.db.userBook.update({
      where: {
        userId_bookId: { userId, bookId },
      },
      data,
      include: { book: true },
    });
  }

  removeBook(userId: number, bookId: number) {
    return this.db.userBook.delete({
      where: {
        userId_bookId: { userId, bookId },
      },
    });
  }
}
