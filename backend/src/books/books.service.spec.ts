import { jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';

import { BooksService } from './books.service.js';
import { BooksRepository } from './repositories/books.repository.js';

describe('BooksService', () => {
  let service: BooksService;
  let repository: {
    findById: jest.Mock;
  };

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
    };

    service = new BooksService(repository as unknown as BooksRepository);
  });

  describe('getBook', () => {
    it('should return the book when it exists', async () => {
      const book = {
        id: 1,
        title: 'Clean Code',
      };

      repository.findById.mockResolvedValue(book);

      const result = await service.getBook(1);

      expect(result).toEqual(book);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when the book does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getBook(999)).rejects.toThrow(NotFoundException);

      expect(repository.findById).toHaveBeenCalledWith(999);
    });
  });
});
