import type { RetrievedChunk } from "@/types/rag";

export function buildContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map((chunk) => `[Chunk ${chunk.index}]\n${chunk.text}`)
    .join("\n\n");
}
