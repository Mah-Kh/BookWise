import { Injectable } from '@nestjs/common';

@Injectable()
export class TextProcessorService {
  clean(text: string): string {
    let result = text.replace(
      /^[\s\S]*?\*\*\* START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK [^\n]*\*\*\*/i,
      '',
    );

    result = result.replace(
      /\*\*\* END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK [^\n]*[\s\S]*$/i,
      '',
    );

    return result.trim();
  }
}
