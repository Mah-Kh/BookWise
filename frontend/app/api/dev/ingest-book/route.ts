import { enrichBook } from "@/services/bookEnrichmentService";
import { embedChunks } from "@/services/embeddingService";
import { storeChunks } from "@/services/vectorStore";
import { chunkText } from "@/utils/chunkText";

export async function POST() {
  const bookId = "OL66554W";

  const book = await enrichBook(bookId);

  const chunks = chunkText(book.bookText, 500, 100).slice(0, 50);

  const embeddedChunks = await embedChunks(chunks);

  storeChunks(embeddedChunks);

  return Response.json({
    title: book.title,
    chunkCount: embeddedChunks.length,
    embeddingDimensions: embeddedChunks[0]?.embedding.length ?? 0,
  });
}
