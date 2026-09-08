import { enrichBook } from "@/services/bookEnrichmentService";
import { embedChunks } from "@/services/embeddingService";
import { chunkText } from "@/utils/chunkText";

export async function GET() {
  const bookId = "OL66554W";

  const book = await enrichBook(bookId);

  //   const chunks = chunkText(book.bookText, 1000, 200);
  const chunks = chunkText(book.bookText, 1000, 200).slice(0, 5);

  const embeddedChunks = await embedChunks(chunks);

  return Response.json({
    title: book.title,
    chunkCount: embeddedChunks.length,
    embeddingDimensions: embeddedChunks[0]?.embedding.length ?? 0,
    sampleChunks: embeddedChunks.slice(0, 3),
  });
}
