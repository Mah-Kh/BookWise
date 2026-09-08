import { describe, expect, it } from "vitest";
import { chunkText } from "./chunkText";

describe("chunkText", () => {
  it("creates overlapping chunks", () => {
    const text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const chunks = chunkText(text, 10, 3);

    expect(chunks).toHaveLength(4);

    expect(chunks[0]).toEqual({
      index: 0,
      text: "ABCDEFGHIJ",
    });

    expect(chunks[1]).toEqual({
      index: 1,
      text: "HIJKLMNOPQ",
    });

    expect(chunks[2]).toEqual({
      index: 2,
      text: "OPQRSTUVWX",
    });

    expect(chunks[3]).toEqual({
      index: 3,
      text: "VWXYZ",
    });
  });

  it("handles text shorter than chunk size", () => {
    const chunks = chunkText("hello", 10, 2);

    expect(chunks).toEqual([
      {
        index: 0,
        text: "hello",
      },
    ]);
  });

  it("rejects an invalid chunk size", () => {
    expect(() => chunkText("hello", 0, 0)).toThrow();
  });

  it("rejects invalid overlap", () => {
    expect(() => chunkText("hello", 10, 10)).toThrow();
  });

  it("returns an empty array for empty text", () => {
    const chunks = chunkText("", 10, 3);

    expect(chunks).toEqual([]);
  });
});
