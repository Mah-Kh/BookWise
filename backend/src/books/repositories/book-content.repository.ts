import { Inject, Injectable } from '@nestjs/common';
import type { Database } from '../../prisma/db.js';

@Injectable()
export class BookContentRepository {
  constructor(
    @Inject('DATABASE')
    private readonly db: Database,
  ) {}

  async create(bookId: number, source: string) {
    return this.db.bookContent.upsert({
      where: {
        bookId,
      },
      create: {
        bookId,
        source,
      },
      update: {
        source,
        error: null,
        status: 'PENDING',
      },
    });
  }

  async findById(id: number) {
    return this.db.bookContent.findUnique({
      where: { id },
    });
  }

  async findByBookId(bookId: number) {
    return this.db.bookContent.findUnique({
      where: { bookId },
    });
  }

  async updateStatus(
    id: number,
    status: 'PENDING' | 'PROCESSING' | 'READY' | 'UNAVAILABLE' | 'FAILED',
    error?: string | null,
  ) {
    return this.db.bookContent.update({
      where: { id },
      data: {
        status,
        error,
      },
    });
  }

  async updateContent(
    id: number,
    data: {
      externalId?: string;
      fullText?: string;
      status: 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';
      error?: string | null;
    },
  ) {
    return this.db.bookContent.update({
      where: { id },
      data,
    });
  }
}
