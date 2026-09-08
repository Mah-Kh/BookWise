import { describe, expect, it } from "vitest";
import { cosineSimilarity } from "./cosineSimilarity";

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    const vector = [1, 2, 3];

    expect(cosineSimilarity(vector, vector)).toBeCloseTo(1);
  });

  it("returns 0 for perpendicular vectors", () => {
    const vectorA = [1, 0];
    const vectorB = [0, 1];

    expect(cosineSimilarity(vectorA, vectorB)).toBeCloseTo(0);
  });

  it("rejects vectors with different dimensions", () => {
    expect(() => cosineSimilarity([1, 2], [1, 2, 3])).toThrow();
  });

  it("rejects zero vectors", () => {
    expect(() => cosineSimilarity([0, 0], [1, 2])).toThrow();
  });
});
