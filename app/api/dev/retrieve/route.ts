import { embedText } from "@/services/embeddingService";
import { getStoredChunks } from "@/services/vectorStore";
import { retrieveChunks } from "@/utils/retrieveChunks";

export async function POST(request: Request) {
  const { question } = await request.json();

  if (!question?.trim()) {
    return Response.json({ error: "Question is required" }, { status: 400 });
  }

  const embeddedChunks = getStoredChunks();

  if (embeddedChunks.length === 0) {
    return Response.json(
      { error: "No embedded book found. Run ingestion first." },
      { status: 400 },
    );
  }

  const questionEmbedding = await embedText(question);

  const retrievedChunks = retrieveChunks(questionEmbedding, embeddedChunks, 3);

  return Response.json({
    question,
    results: retrievedChunks.map((chunk) => ({
      index: chunk.index,
      score: chunk.score,
      text: chunk.text,
    })),
  });
}
