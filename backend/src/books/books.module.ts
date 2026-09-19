import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PrismaModule } from '../prisma/prisma.module.js';

import { BooksController } from './books.controller.js';
import { BooksService } from './books.service.js';
import { BooksRepository } from './repositories/books.repository.js';
import { BookContentRepository } from './repositories/book-content.repository.js';
import { BookChunkRepository } from './repositories/book-chunk.repository.js';

import { OpenLibraryService } from './open-library.service.js';
import { GutendexService } from './gutendex.service.js';
import { TextProcessorService } from './text-processor.service.js';
import { BookIngestionService } from './book-ingestion.service.js';
import { ChunkingService } from './chunking.service.js';
import { EmbeddingService } from './embedding.service.js';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [BooksController],
  providers: [
    BooksService,
    BooksRepository,
    BookContentRepository,
    BookChunkRepository,
    OpenLibraryService,
    GutendexService,
    TextProcessorService,
    BookIngestionService,
    ChunkingService,
    EmbeddingService,
  ],
  exports: [
    BooksRepository,
    BookContentRepository,
    BookChunkRepository,
    EmbeddingService,
    BookIngestionService,
  ],
})
export class BooksModule {}
