import { embedText } from "@/services/embeddingService";

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return Response.json({ error: "Text is required" }, { status: 400 });
  }

  const embedding = await embedText(text);

  return Response.json({
    dimensions: embedding.length,
    embedding,
  });
}

/*
 * LEARNING NOTE
 *
 * Previous version:
 *
 * This version called Ollama directly inside the API route.
 * It was useful for learning how the HTTP request to Ollama works,
 * but the Ollama integration has now been moved to embeddingService.ts.
 *
 * Keeping the integration in a service makes the API route simpler
 * and allows other parts of the application to reuse embedText().
 *
 * Previous code:
 *
 * export async function POST(request: Request) {
 *   const { text } = await request.json();
 *
 *   if (!text) {
 *     return Response.json(
 *       { error: "Text is required" },
 *       { status: 400 },
 *     );
 *   }
 *
 *   const response = await fetch(
 *     "http://localhost:11434/api/embed",
 *     {
 *       method: "POST",
 *       headers: {
 *         "Content-Type": "application/json",
 *       },
 *       body: JSON.stringify({
 *         model: "nomic-embed-text",
 *         input: text,
 *       }),
 *     },
 *   );
 *
 *   if (!response.ok) {
 *     throw new Error(
 *       `Failed to generate embedding: ${response.status}`,
 *     );
 *   }
 *
 *   const data = await response.json();
 *
 *   return Response.json(data);
 * }
 */
