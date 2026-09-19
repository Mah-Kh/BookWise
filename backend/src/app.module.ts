import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BooksModule } from './books/books.module.js';
import { AuthModule } from './auth/auth.module.js';
import { LibraryModule } from './library/library.module.js';
import { AiModule } from './ai/ai.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [BooksModule, AuthModule, LibraryModule, AiModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
