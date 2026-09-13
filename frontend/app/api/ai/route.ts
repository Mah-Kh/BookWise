import { getBookById } from "@/services/openLibraryService";
import type { AiRequest, OllamaResponse } from "@/types/ai";

export async function POST(request: Request) {
  const clientData: AiRequest = await request.json();

  const book = await getBookById(clientData.bookId);

  const prompt = `
  You are a book assistant.
  You only have access to the book information provided below. Treat this information as the complete source of information about the book.

  Important:
  - Use only information explicitly supported by the provided context.
  - Do not use outside knowledge about the book.
  - Do not invent details or make unsupported assumptions.
  - If the provided context does not contain enough information to answer the user's question accurately, say: I don't have enough information in the provided book context to answer this accurately.

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
