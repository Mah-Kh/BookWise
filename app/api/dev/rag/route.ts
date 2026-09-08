import { embedText } from "@/services/embeddingService";
import { getStoredChunks } from "@/services/vectorStore";
import { buildContext } from "@/utils/buildContext";
import { retrieveChunks } from "@/utils/retrieveChunks";
import type { OllamaResponse } from "@/types/ai";

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

  const context = buildContext(retrievedChunks);

  const prompt = `
You are a book analysis assistant.

Answer the user's question using only the provided book context.

Rules:
- Use only information supported by the context.
- Do not use outside knowledge.
- Do not invent facts.
- Clearly distinguish between facts directly supported by the context
  and reasonable interpretations.
- Do not present an interpretation as a fact.
- Never mention chunk numbers, chunk IDs, retrieval scores, embeddings,
  vector search, or internal system details.
- Do not cite or reference the provided context using labels such as
  "Chunk 35" or "Chunk 27".
- Answer naturally as if you already knew the relevant passage from the book.
- If the context is insufficient, say:
"I don't have enough information in the provided book context to answer this accurately."

Book context:
${context}

User question:
${question}
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2",
      prompt,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate AI response: ${response.status}`);
  }

  const aiResponse: OllamaResponse = await response.json();

  return Response.json({
    question,
    answer: aiResponse.response,
    sources: retrievedChunks.map((chunk) => ({
      index: chunk.index,
      score: chunk.score,
      text: chunk.text,
    })),
  });
}
