import { Inject, Injectable } from '@nestjs/common';

import type { Database } from '../../prisma/db.js';
import type { ReadingStatus } from '../../generated/prisma/enums.js';

@Injectable()
export class LibraryRepository {
  constructor(
    @Inject('DATABASE')
    private readonly db: Database,
  ) {}

  async findByUserAndBook(userId: number, bookId: number) {
    return this.db.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });
  }

  async findByUser(userId: number) {
    return this.db.userBook.findMany({
      where: { userId },
    });
  }

  async create(userId: number, bookId: number) {
    return this.db.userBook.create({
      data: {
        userId,
        bookId,
      },
    });
  }

  async delete(userId: number, bookId: number) {
    return this.db.userBook.delete({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });
  }

  async updateStatus(userId: number, bookId: number, status: ReadingStatus) {
    return this.db.userBook.update({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      data: {
        status,
      },
    });
  }

  async updateFavorite(userId: number, bookId: number, isFavorite: boolean) {
    return this.db.userBook.update({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      data: {
        isFavorite,
      },
    });
  }
}
