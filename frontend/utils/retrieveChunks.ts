import type { EmbeddedChunk, RetrievedChunk } from "@/types/rag";
import { cosineSimilarity } from "./cosineSimilarity";

export function retrieveChunks(
  queryEmbedding: number[],
  chunks: EmbeddedChunk[],
  topK: number,
): RetrievedChunk[] {
  const scoredChunks = chunks.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scoredChunks.sort((a, b) => b.score - a.score);

  return scoredChunks.slice(0, topK);
}
