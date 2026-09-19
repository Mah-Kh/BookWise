import { Injectable } from '@nestjs/common';
import { embed } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';

@Injectable()
export class EmbeddingService {
  async embedText(text: string): Promise<number[]> {
    const { embedding } = await embed({
      model: ollama.embedding('nomic-embed-text'),
      value: text,
    });

    return embedding;
  }
}
