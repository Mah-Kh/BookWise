import { describe, expect, it } from "vitest";
import { retrieveChunks } from "./retrieveChunks";

describe("retrieveChunks", () => {
  it("returns the most similar chunks first", () => {
    const queryEmbedding = [1, 0];

    const chunks = [
      {
        index: 0,
        text: "Unrelated text",
        embedding: [0, 1],
      },
      {
        index: 1,
        text: "Relevant text",
        embedding: [1, 0],
      },
      {
        index: 2,
        text: "Somewhat relevant text",
        embedding: [0.8, 0.2],
      },
    ];

    const results = retrieveChunks(queryEmbedding, chunks, 2);

    expect(results).toHaveLength(2);
    expect(results[0].index).toBe(1);
    expect(results[1].index).toBe(2);
  });

  it("limits the number of returned chunks", () => {
    const queryEmbedding = [1, 0];

    const chunks = [
      {
        index: 0,
        text: "A",
        embedding: [1, 0],
      },
      {
        index: 1,
        text: "B",
        embedding: [0.9, 0.1],
      },
      {
        index: 2,
        text: "C",
        embedding: [0.8, 0.2],
      },
    ];

    const results = retrieveChunks(queryEmbedding, chunks, 2);

    expect(results).toHaveLength(2);
  });
});
