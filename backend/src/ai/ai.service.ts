import { Injectable, NotFoundException } from '@nestjs/common';
import { generateText, streamText, Output, tool, stepCountIs } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';
import { BookContentRepository } from '../books/repositories/book-content.repository.js';
import { BookChunkRepository } from '../books/repositories/book-chunk.repository.js';
import { BooksRepository } from '../books/repositories/books.repository.js';
import { EmbeddingService } from '../books/embedding.service.js';

@Injectable()
export class AiService {
  constructor(
    private readonly bookContentRepository: BookContentRepository,
    private readonly bookChunkRepository: BookChunkRepository,
    private readonly booksRepository: BooksRepository,
    private readonly embeddingService: EmbeddingService,
  ) {}
  async generate(prompt: string) {
    const result = await generateText({
      model: ollama('llama3.2'),
      system: 'You are a helpful book assistant.',
      prompt,
    });

    return result.text;
  }

  async summarizeBook(bookId: number) {
    const content = await this.bookContentRepository.findByBookId(bookId);

    if (!content || content.status !== 'READY' || !content.fullText) {
      throw new NotFoundException('Ready book content not found');
    }

    const result = await generateText({
      model: ollama('llama3.2'),

      output: Output.object({
        schema: z.object({
          summary: z.string(),
          themes: z.array(z.string()),
          difficulty: z.enum(['easy', 'medium', 'hard']),
        }),
      }),

      system: 'Analyze the book accurately and concisely.',

      prompt: `Analyze this book:

${content.fullText}`,
    });

    return result.output;
  }

  async streamAnswer(prompt: string) {
    return streamText({
      model: ollama('llama3.2'),
      system: 'You are a helpful book assistant.',
      prompt,
    });
  }

  async streamBookAnswer(externalId: string, question: string) {
    const book = await this.booksRepository.findByExternalId(externalId);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const content = await this.bookContentRepository.findByBookId(book.id);

    if (!content || content.status !== 'READY' || !content.fullText) {
      throw new NotFoundException('Ready book content not found');
    }

    const chunks = await this.bookChunkRepository.findByContentId(content.id);

    if (chunks.length === 0) {
      throw new NotFoundException('No chunks found for this book');
    }

    const relevantChunks = await this.retrieveRelevantChunks(
      content.id,
      question,
    );

    const context = relevantChunks.map((chunk) => chunk.text).join('\n\n');

    return streamText({
      model: ollama('llama3.2'),

      system: `
You are a helpful reading companion.

Answer the user's question using only the provided book context.

Rules:
- Do not invent facts.
- Do not use outside knowledge.
- If the context does not contain enough information, say:
  "I couldn't find enough information in the available book text."
- Keep the answer concise and clear.
`,

      prompt: `
Book context:
${context}

User question:
${question}
`,
    });
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private async retrieveRelevantChunks(contentId: number, question: string) {
    if (!question?.trim()) {
      throw new Error('Question is empty or undefined');
    }

    const questionEmbedding = await this.embeddingService.embedText(question);

    const chunks = await this.bookChunkRepository.findByContentId(contentId);

    const scoredChunks = chunks
      .filter((chunk) => Array.isArray(chunk.embedding))
      .map((chunk) => ({
        ...chunk,
        score: this.cosineSimilarity(
          questionEmbedding,
          chunk.embedding as number[],
        ),
      }));

    return scoredChunks.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  async askWithTools(prompt: string) {
    const result = await generateText({
      model: ollama('llama3.2'),

      system: `
You are a helpful book assistant.

Use the available tools when you need information
about a book.

After receiving tool results, answer the user clearly.
`,

      tools: {
        getBookInfo: tool({
          description:
            'Get basic information about a book from the Bookwise database.',

          inputSchema: z.object({
            externalId: z
              .string()
              .describe('The OpenLibrary work ID of the book'),
          }),

          execute: async ({ externalId }) => {
            const book =
              await this.booksRepository.findByExternalId(externalId);

            if (!book) {
              return {
                found: false,
                message: 'Book not found.',
              };
            }

            return {
              found: true,
              id: book.id,
              title: book.title,
              externalId: book.externalId,
            };
          },
        }),
      },

      stopWhen: stepCountIs(3),

      prompt,
    });

    return result.text;
  }
}
