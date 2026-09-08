import { enrichBook } from "@/services/bookEnrichmentService";
import { chunkText } from "@/utils/chunkText";

export async function GET() {
  const bookId = "OL66554W"; // Replace with a Gutenberg-compatible book ID

  const book = await enrichBook(bookId);

  const experiments = [
    { chunkSize: 500, overlap: 100 },
    { chunkSize: 1000, overlap: 200 },
    { chunkSize: 2000, overlap: 400 },
  ];

  const results = experiments.map(({ chunkSize, overlap }) => {
    const chunks = chunkText(book.bookText, chunkSize, overlap);

    return {
      chunkSize,
      overlap,
      chunkCount: chunks.length,
      sampleChunks: chunks.slice(0, 3),
    };
  });

  return Response.json({
    title: book.title,
    textLength: book.bookText.length,
    results,
  });
}
