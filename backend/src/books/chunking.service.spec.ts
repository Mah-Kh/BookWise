import { ChunkingService } from './chunking.service.js';

describe('ChunkingService', () => {
  let service: ChunkingService;

  beforeEach(() => {
    service = new ChunkingService();
  });

  it('should return empty array for empty text', () => {
    expect(service.chunk('')).toEqual([]);
    expect(service.chunk('   ')).toEqual([]);
  });

  it('should split text into chunks', () => {
    const text = 'abcdefghij';

    const result = service.chunk(text, 4, 1);

    expect(result).toEqual([
      { index: 0, text: 'abcd' },
      { index: 1, text: 'defg' },
      { index: 2, text: 'ghij' },
    ]);
  });

  it('should preserve chunk indexes', () => {
    const result = service.chunk('abcdefghijklmnopqrstuvwxyz', 10, 2);

    expect(result.map((chunk) => chunk.index)).toEqual([0, 1, 2]);
  });

  it('should reject invalid overlap', () => {
    expect(() => service.chunk('hello', 10, 10)).toThrow(
      'Chunk overlap must be smaller than chunk size',
    );
  });
});
