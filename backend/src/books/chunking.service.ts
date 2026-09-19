import { Injectable } from '@nestjs/common';

export type TextChunk = {
  index: number;
  text: string;
};

@Injectable()
export class ChunkingService {
  chunk(text: string, chunkSize = 4000, overlap = 400): TextChunk[] {
    if (!text.trim()) {
      return [];
    }

    if (overlap >= chunkSize) {
      throw new Error('Chunk overlap must be smaller than chunk size');
    }

    const chunks: TextChunk[] = [];

    let start = 0;
    let index = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);

      const chunk = text.slice(start, end).trim();

      if (chunk) {
        chunks.push({
          index,
          text: chunk,
        });

        index++;
      }

      if (end === text.length) {
        break;
      }

      start = end - overlap;
    }

    return chunks;
  }
}
