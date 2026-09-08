export type TextChunk = {
  index: number;
  text: string;
};

export type EmbeddedChunk = TextChunk & {
  embedding: number[];
};

export type RetrievedChunk = EmbeddedChunk & {
  score: number;
};
