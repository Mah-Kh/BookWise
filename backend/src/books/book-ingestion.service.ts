import { Injectable, NotFoundException } from '@nestjs/common';

import { BooksRepository } from './repositories/books.repository.js';
import { BookContentRepository } from './repositories/book-content.repository.js';
import { GutendexService } from './gutendex.service.js';
import { TextProcessorService } from './text-processor.service.js';
import { BookChunkRepository } from './repositories/book-chunk.repository.js';
import { ChunkingService } from './chunking.service.js';
import { EmbeddingService } from './embedding.service.js';

@Injectable()
export class BookIngestionService {
  constructor(
    private readonly booksRepository: BooksRepository,
    private readonly bookContentRepository: BookContentRepository,
    private readonly bookChunkRepository: BookChunkRepository,
    private readonly gutendexService: GutendexService,
    private readonly textProcessorService: TextProcessorService,
    private readonly chunkingService: ChunkingService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  // async ingest(bookId: number) {
  //   const book = await this.booksRepository.findById(bookId);

  //   if (!book) {
  //     throw new NotFoundException('Book not found');
  //   }

  //   const content = await this.bookContentRepository.create(bookId, 'gutendex');

  //   try {
  //     await this.bookContentRepository.updateStatus(content.id, 'PROCESSING');

  //     const externalBook = await this.gutendexService.findByTitle(book.title);

  //     const downloaded = await this.gutendexService.getText(externalBook);

  //     const fullText = this.textProcessorService.clean(downloaded.text);

  //     await this.bookContentRepository.updateContent(content.id, {
  //       externalId: downloaded.externalId,
  //       fullText,
  //       status: 'PROCESSING',
  //       error: null,
  //     });

  //     const chunks = this.chunkingService.chunk(fullText);

  //     await this.bookChunkRepository.deleteByContentId(content.id);

  //     const chunksWithEmbeddings = [];

  //     for (const chunk of chunks) {
  //       const embedding = await this.embeddingService.embedText(chunk.text);

  //       chunksWithEmbeddings.push({
  //         index: chunk.index,
  //         text: chunk.text,
  //         embedding,
  //       });
  //     }

  //     await this.bookChunkRepository.createMany(
  //       content.id,
  //       chunksWithEmbeddings,
  //     );

  //     return await this.bookContentRepository.updateStatus(
  //       content.id,
  //       'READY',
  //       null,
  //     );
  //   } catch (error) {
  //     await this.bookContentRepository.updateStatus(
  //       content.id,
  //       'FAILED',
  //       error instanceof Error ? error.message : 'Unknown ingestion error',
  //     );

  //     throw error;
  //   }
  // }

  async ingest(bookId: number) {
    const book = await this.booksRepository.findById(bookId);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    let content = await this.bookContentRepository.findByBookId(bookId);

    if (!content) {
      content = await this.bookContentRepository.create(bookId, 'gutendex');
    }

    // Already ingested successfully.
    if (content.status === 'READY') {
      return content;
    }

    try {
      await this.bookContentRepository.updateStatus(
        content.id,
        'PROCESSING',
        null,
      );

      const externalBook = await this.gutendexService.findByTitle(book.title);

      const downloaded = await this.gutendexService.getText(externalBook);

      const fullText = this.textProcessorService.clean(downloaded.text);

      await this.bookContentRepository.updateContent(content.id, {
        externalId: downloaded.externalId,
        fullText,
        status: 'PROCESSING',
        error: null,
      });

      const chunks = this.chunkingService.chunk(fullText);

      await this.bookChunkRepository.deleteByContentId(content.id);

      const chunksWithEmbeddings = [];

      for (const chunk of chunks) {
        const embedding = await this.embeddingService.embedText(chunk.text);

        chunksWithEmbeddings.push({
          index: chunk.index,
          text: chunk.text,
          embedding,
        });
      }

      await this.bookChunkRepository.createMany(
        content.id,
        chunksWithEmbeddings,
      );

      return await this.bookContentRepository.updateStatus(
        content.id,
        'READY',
        null,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown ingestion error';

      // Book exists, but its full text is unavailable.
      if (error instanceof NotFoundException) {
        return await this.bookContentRepository.updateStatus(
          content.id,
          'UNAVAILABLE',
          message,
        );
      }

      await this.bookContentRepository.updateStatus(
        content.id,
        'FAILED',
        message,
      );

      throw error;
    }
  }

  async embedExistingChunks(bookId: number) {
    const content = await this.bookContentRepository.findByBookId(bookId);

    if (!content) {
      throw new NotFoundException('Book content not found');
    }

    const chunks = await this.bookChunkRepository.findByContentId(content.id);

    if (chunks.length === 0) {
      throw new NotFoundException('No chunks found');
    }

    for (const chunk of chunks) {
      const embedding = await this.embeddingService.embedText(chunk.text);

      await this.bookChunkRepository.updateEmbedding(chunk.id, embedding);
    }

    return {
      success: true,
      chunksProcessed: chunks.length,
    };
  }
}
