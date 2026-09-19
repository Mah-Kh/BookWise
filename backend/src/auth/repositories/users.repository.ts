import { Inject, Injectable } from '@nestjs/common';

import type { Database } from '../../prisma/db.js';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('DATABASE')
    private readonly db: Database,
  ) {}

  async findByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.db.user.findUnique({
      where: { id },
    });
  }

  async create(email: string, passwordHash: string) {
    return this.db.user.create({
      data: {
        email,
        passwordHash,
      },
    });
  }
}
