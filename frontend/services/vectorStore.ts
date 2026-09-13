import type { EmbeddedChunk } from "@/types/rag";

let storedChunks: EmbeddedChunk[] = [];

export function storeChunks(chunks: EmbeddedChunk[]) {
  storedChunks = chunks;
}

export function getStoredChunks(): EmbeddedChunk[] {
  return storedChunks;
}

export function clearStoredChunks() {
  storedChunks = [];
}
