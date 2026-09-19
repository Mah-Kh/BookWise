import { jest } from '@jest/globals';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { AuthService } from './auth.service.js';
import { UsersRepository } from './repositories/users.repository.js';

describe('AuthService', () => {
  let service: AuthService;

  let repository: {
    findByEmail: jest.MockedFunction<UsersRepository['findByEmail']>;
    create: jest.MockedFunction<UsersRepository['create']>;
  };

  let jwtService: {
    signAsync: jest.Mock<() => Promise<string>>;
  };

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn<() => Promise<string>>(),
    };

    service = new AuthService(
      repository as unknown as UsersRepository,
      jwtService as unknown as JwtService,
    );
  });

  describe('register', () => {
    it('should create a user when email is available', async () => {
      repository.findByEmail.mockResolvedValue(null);

      repository.create.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        createdAt: new Date(),
      });

      const result = await service.register({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');

      expect(repository.create).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String),
      );

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        createdAt: expect.any(Date),
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      repository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        createdAt: new Date(),
      });

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);

      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return an access token with valid credentials', async () => {
      repository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('password123', 12),
        createdAt: new Date(),
      });

      jwtService.signAsync.mockResolvedValue('fake-access-token');

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        accessToken: 'fake-access-token',
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@example.com',
      });

      expect(result.accessToken).toBeDefined();
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      repository.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      repository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('correct-password', 12),
        createdAt: new Date(),
      });

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
