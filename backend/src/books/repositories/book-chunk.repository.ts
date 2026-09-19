import { Inject, Injectable } from '@nestjs/common';

import type { Database } from '../../prisma/db.js';

@Injectable()
export class BookChunkRepository {
  constructor(
    @Inject('DATABASE')
    private readonly db: Database,
  ) {}

  async deleteByContentId(contentId: number) {
    return this.db.bookChunk.deleteMany({
      where: { contentId },
    });
  }

  async createMany(
    contentId: number,
    chunks: Array<{
      index: number;
      text: string;
      embedding: number[];
    }>,
  ) {
    return this.db.bookChunk.createMany({
      data: chunks.map((chunk) => ({
        contentId,
        index: chunk.index,
        text: chunk.text,
        embedding: chunk.embedding,
      })),
    });
  }

  async findByContentId(contentId: number) {
    return this.db.bookChunk.findMany({
      where: { contentId },
      orderBy: { index: 'asc' },
    });
  }

  async updateEmbedding(id: number, embedding: number[]) {
    return this.db.bookChunk.update({
      where: { id },
      data: { embedding },
    });
  }
}
