import { jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { BookIngestionService } from './book-ingestion.service.js';
describe('BookIngestionService', () => {
  const booksRepository = {
    findById:
      jest.fn<(id: number) => Promise<{ id: number; title: string } | null>>(),
  };
  const bookContentRepository = {
    create: jest.fn(),
    updateStatus: jest.fn(),
    updateContent: jest.fn(),
  };
  const bookChunkRepository = {
    deleteByContentId: jest.fn(),
    createMany: jest.fn(),
  };
  const gutendexService = { findByTitle: jest.fn(), getText: jest.fn() };
  const textProcessorService = { clean: jest.fn() };
  const chunkingService = { chunk: jest.fn() };
  let service: BookIngestionService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new BookIngestionService(
      booksRepository as any,
      bookContentRepository as any,
      bookChunkRepository as any,
      gutendexService as any,
      textProcessorService as any,
      chunkingService as any,
    );
  });
  it('should throw when the book does not exist', async () => {
    booksRepository.findById.mockResolvedValue(null);
    await expect(service.ingest(999)).rejects.toThrow(NotFoundException);
    expect(booksRepository.findById).toHaveBeenCalledWith(999);
    expect(bookContentRepository.create).not.toHaveBeenCalled();
  });
  it('should ingest, chunk and persist book content', async () => {
    booksRepository.findById.mockResolvedValue({
      id: 3,
      title: 'Pride and Prejudice',
    });
    bookContentRepository.create.mockResolvedValue({
      id: 10,
      bookId: 3,
      source: 'gutendex',
    });
    gutendexService.findByTitle.mockResolvedValue({
      id: 1342,
      title: 'Pride and Prejudice',
      formats: {},
    });
    gutendexService.getText.mockResolvedValue({
      externalId: '1342',
      text: 'raw book text',
    });
    textProcessorService.clean.mockReturnValue('clean book text');
    const chunks = [{ index: 0, text: 'clean book text' }];
    chunkingService.chunk.mockReturnValue(chunks);
    bookContentRepository.updateContent.mockResolvedValue({
      id: 10,
      status: 'PROCESSING',
    });
    bookContentRepository.updateStatus.mockResolvedValue({
      id: 10,
      status: 'READY',
    });
    const result = await service.ingest(3);
    expect(bookContentRepository.create).toHaveBeenCalledWith(3, 'gutendex');
    expect(bookContentRepository.updateStatus).toHaveBeenNthCalledWith(
      1,
      10,
      'PROCESSING',
    );
    expect(gutendexService.findByTitle).toHaveBeenCalledWith(
      'Pride and Prejudice',
    );
    expect(gutendexService.getText).toHaveBeenCalled();
    expect(textProcessorService.clean).toHaveBeenCalledWith('raw book text');
    expect(bookContentRepository.updateContent).toHaveBeenCalledWith(10, {
      externalId: '1342',
      fullText: 'clean book text',
      status: 'PROCESSING',
      error: null,
    });
    expect(chunkingService.chunk).toHaveBeenCalledWith('clean book text');
    expect(bookChunkRepository.deleteByContentId).toHaveBeenCalledWith(10);
    expect(bookChunkRepository.createMany).toHaveBeenCalledWith(10, chunks);
    expect(bookContentRepository.updateStatus).toHaveBeenNthCalledWith(
      2,
      10,
      'READY',
      null,
    );
    expect(result).toEqual({ id: 10, status: 'READY' });
  });
  it('should mark content as FAILED when ingestion fails', async () => {
    booksRepository.findById.mockResolvedValue({
      id: 3,
      title: 'Pride and Prejudice',
    });
    bookContentRepository.create.mockResolvedValue({
      id: 10,
      bookId: 3,
      source: 'gutendex',
    });
    const error = new Error('Gutendex unavailable');
    gutendexService.findByTitle.mockRejectedValue(error);
    await expect(service.ingest(3)).rejects.toThrow('Gutendex unavailable');
    expect(bookContentRepository.updateStatus).toHaveBeenNthCalledWith(
      1,
      10,
      'PROCESSING',
    );
    expect(bookContentRepository.updateStatus).toHaveBeenNthCalledWith(
      2,
      10,
      'FAILED',
      'Gutendex unavailable',
    );
    expect(bookChunkRepository.createMany).not.toHaveBeenCalled();
  });
});
