import { enrichBook } from "@/services/bookEnrichmentService";
import type { AiRequest, OllamaResponse } from "@/types/ai";

export async function POST(request: Request) {
  const clientData: AiRequest = await request.json();

  const start = Date.now();

  const book = await enrichBook(clientData.bookId);

  const prompt = `
  You are a book assistant.
  Answer the user's question using the provided book context.

  Important:
  - Use only the information available in the provided context.
  - Do not invent or assume details that are not supported by the context.
  - The provided book text may be incomplete.
  - If the context does not contain enough information to answer reliably, say that you do not have enough context to answer accurately.
  Use the following book context to answer the user's question.

  Book:
  Title: ${book.title}
  Authors: ${book.authors.join(", ")}
  Description: ${book.description}
  Subjects: ${book.subjects.join(", ")}

  User question:
  ${clientData.message}
  `;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2",
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate AI response: ${response.status}`);
  }

  const aiResponse: OllamaResponse = await response.json();

  return Response.json({
    response: aiResponse.response,
  });
}
