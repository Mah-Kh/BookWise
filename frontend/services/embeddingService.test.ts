import { describe, expect, it, vi } from "vitest";
import { embedText } from "./embeddingService";

describe("embedText", () => {
  it("returns the embedding from Ollama", async () => {
    const mockEmbedding = [0.1, 0.2, 0.3];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          embeddings: [mockEmbedding],
        }),
      }),
    );

    const result = await embedText("Elizabeth dislikes Darcy.");

    expect(result).toEqual(mockEmbedding);
  });

  it("rejects empty text", async () => {
    await expect(embedText("")).rejects.toThrow("Text is required");
  });

  it("throws when Ollama returns an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(embedText("Elizabeth dislikes Darcy.")).rejects.toThrow(
      "Failed to generate embedding: 500",
    );
  });

  it("throws when Ollama returns no embedding", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          embeddings: [],
        }),
      }),
    );

    await expect(embedText("Elizabeth dislikes Darcy.")).rejects.toThrow(
      "No embedding returned",
    );
  });
});
