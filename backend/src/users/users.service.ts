import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getLibrary(userId: number) {
    return this.usersRepository.findLibrary(userId);
  }

  addBook(userId: number, title: string, externalId: string) {
    return this.usersRepository.addBook(userId, title, externalId);
  }

  updateBook(
    userId: number,
    bookId: number,
    data: {
      status?: 'WANT_TO_READ' | 'READING' | 'COMPLETED';
      isFavorite?: boolean;
    },
  ) {
    return this.usersRepository.updateBook(userId, bookId, data);
  }

  removeBook(userId: number, bookId: number) {
    return this.usersRepository.removeBook(userId, bookId);
  }
}
