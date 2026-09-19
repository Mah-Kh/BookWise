import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AiService } from './ai.service.js';
import { SummarizeBookDto } from './dto/summarize-book.dto.js';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  generate(@Body('prompt') prompt: string) {
    return this.aiService.generate(prompt);
  }

  @Post('summarize')
  summarize(@Body() dto: SummarizeBookDto) {
    return this.aiService.summarizeBook(dto.bookId);
  }

  @Post('books/:bookId/chat')
  async chatWithBook(
    @Param('bookId') bookId: string,
    @Body() body: { prompt: string },
    @Res() response: Response,
  ) {
    try {
      const result = await this.aiService.streamBookAnswer(bookId, body.prompt);

      response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      response.setHeader('Transfer-Encoding', 'chunked');

      for await (const chunk of result.textStream) {
        response.write(chunk);
      }

      response.end();
    } catch (error) {
      console.error('CHAT ENDPOINT ERROR:', error);

      if (!response.headersSent) {
        response.status(500).json({
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      } else {
        response.end();
      }
    }
  }

  @Post('stream')
  async stream(@Body('prompt') prompt: string, @Res() response: Response) {
    const result = await this.aiService.streamAnswer(prompt);

    response.setHeader('Content-Type', 'text/plain; charset=utf-8');

    response.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of result.textStream) {
      response.write(chunk);
    }

    response.end();
  }

  @Post('tools')
  askWithTools(@Body() body: { prompt: string }) {
    return this.aiService.askWithTools(body.prompt);
  }
}
