import { Module } from '@nestjs/common';

import { BooksModule } from '../books/books.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { LibraryController } from './library.controller.js';
import { LibraryService } from './library.service.js';
import { LibraryRepository } from './repositories/library.repository.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, BooksModule, AuthModule],
  controllers: [LibraryController],
  providers: [LibraryService, LibraryRepository],
})
export class LibraryModule {}
