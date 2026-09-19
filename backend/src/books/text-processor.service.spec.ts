import { TextProcessorService } from './text-processor.service.js';

describe('TextProcessorService', () => {
  let service: TextProcessorService;

  beforeEach(() => {
    service = new TextProcessorService();
  });

  it('should remove the Project Gutenberg start marker', () => {
    const text = `
*** START OF THE PROJECT GUTENBERG EBOOK TEST ***

Hello world.
`;

    expect(service.clean(text)).toBe('Hello world.');
  });

  it('should remove the Project Gutenberg end marker', () => {
    const text = `
Hello world.

*** END OF THE PROJECT GUTENBERG EBOOK TEST ***
`;

    expect(service.clean(text)).toBe('Hello world.');
  });

  it('should remove both start and end markers', () => {
    const text = `
Header

*** START OF THE PROJECT GUTENBERG EBOOK TEST ***

Book content.

*** END OF THE PROJECT GUTENBERG EBOOK TEST ***

Footer
`;

    expect(service.clean(text)).toBe('Book content.');
  });

  it('should trim surrounding whitespace', () => {
    expect(service.clean('   Hello world   ')).toBe('Hello world');
  });
});
