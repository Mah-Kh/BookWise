import { Inject, Injectable } from '@nestjs/common';
import type { Database } from '../../prisma/db.js';
import type { FieldOutputTypes } from '../../prisma/contract.d.js';

type Book = FieldOutputTypes['public']['Book'];

@Injectable()
export class BooksRepository {
  constructor(
    @Inject('DATABASE')
    private readonly db: Database,
  ) {}

  async findAll(): Promise<Book[]> {
    return await this.db.orm.public.Book.all();
  }

  async findById(id: number): Promise<Book | null> {
    return await this.db.orm.public.Book.where({ id }).first();
  }

  async create(title: string): Promise<Book> {
    return await this.db.orm.public.Book.create({
      title,
    });
  }

  async update(id: number, data: { title: string }): Promise<Book | null> {
    return await this.db.orm.public.Book.where({ id }).update(data);
  }

  async delete(id: number): Promise<Book | null> {
    return await this.db.orm.public.Book.where({ id }).delete();
  }
}
