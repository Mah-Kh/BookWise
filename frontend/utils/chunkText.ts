import type { TextChunk } from "@/types/rag";

export function chunkText(
  text: string,
  chunkSize: number,
  overlap: number,
): TextChunk[] {
  if (chunkSize <= 0) {
    throw new Error("chunkSize must be greater than 0");
  }

  if (overlap < 0 || overlap >= chunkSize) {
    throw new Error("overlap must be >= 0 and smaller than chunkSize");
  }

  const chunks: TextChunk[] = [];
  const step = chunkSize - overlap;

  for (let start = 0; start < text.length; start += step) {
    const chunk = text.slice(start, start + chunkSize);

    chunks.push({
      index: chunks.length,
      text: chunk,
    });
  }

  return chunks;
}
