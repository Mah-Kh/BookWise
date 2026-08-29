import type { AiRequest, OllamaResponse } from "@/types/ai";
import { getBookById } from "@/services/bookService";

export async function POST(request: Request) {
  const clientData: AiRequest = await request.json();

  const bookDetails = await getBookById(clientData.bookId);

  const prompt = `
You are a book assistant.

Book:
Title: ${bookDetails.title}
Description: ${bookDetails.description}
Subjects: ${bookDetails.subjects}

User question: ${clientData.message}
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: prompt,
      stream: false,
    }),
  });

  const aiResponse: OllamaResponse = await response.json();

  return Response.json({
    response: aiResponse.response,
  });
}
