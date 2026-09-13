import type { EmbeddedChunk, TextChunk } from "@/types/rag";

export async function embedText(text: string): Promise<number[]> {
  if (!text.trim()) {
    throw new Error("Text is required");
  }

  const response = await fetch("http://localhost:11434/api/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nomic-embed-text",
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate embedding: ${response.status}`);
  }

  const data: { embeddings: number[][] } = await response.json();

  const embedding = data.embeddings[0];

  if (!embedding) {
    throw new Error("No embedding returned");
  }

  return embedding;
}

export async function embedChunks(
  chunks: TextChunk[],
  concurrency: number = 5,
): Promise<EmbeddedChunk[]> {
  const results: EmbeddedChunk[] = [];

  for (let i = 0; i < chunks.length; i += concurrency) {
    const batch = chunks.slice(i, i + concurrency);

    // Process only a small number of embedding requests at the same time.
    const embeddedBatch = await Promise.all(
      batch.map(async (chunk) => ({
        ...chunk,
        embedding: await embedText(chunk.text),
      })),
    );

    results.push(...embeddedBatch);
  }

  return results;
}

// export async function embedChunks(
//   chunks: TextChunk[],
// ): Promise<EmbeddedChunk[]> {
//   const embeddedChunks = await Promise.all(
//     chunks.map(async (chunk) => ({
//       ...chunk,
//       embedding: await embedText(chunk.text),
//     })),
//   );

//   return embeddedChunks;
// }
