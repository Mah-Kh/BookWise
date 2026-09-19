import { Inject, Injectable } from '@nestjs/common';

import type { Database } from '../../prisma/db.js';

@Injectable()
export class BooksRepository {
  constructor(
    @Inject('DATABASE')
    private readonly db: Database,
  ) {}

  async findAll() {
    return this.db.book.findMany();
  }

  async findById(id: number) {
    return this.db.book.findUnique({
      where: { id },
    });
  }

  async findByExternalId(externalId: string) {
    return this.db.book.findUnique({
      where: { externalId },
    });
  }

  async create(title: string, externalId?: string) {
    return this.db.book.create({
      data: {
        title,
        externalId,
      },
    });
  }

  async update(id: number, data: { title: string }) {
    return this.db.book.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.db.book.delete({
      where: { id },
    });
  }
}
