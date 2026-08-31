import type {
  Book,
  BookMetadata,
  OpenLibraryAuthorReference,
  OpenLibraryWork,
} from "@/types/book";
import {
  getBookById,
  searchOpenLibraryBooks,
} from "@/services/openLibraryService";

export async function getSimilarBooks(book: Book): Promise<Book[]> {
  const bookMetadata = await getBookById(book.id);

  const subjectQueries = bookMetadata.subjects.map(
    (subject) => `subject:${subject}`,
  );

  const similarBookResults = await Promise.all(
    subjectQueries.map((query) => searchOpenLibraryBooks(query)),
  );
  const similarBooks = similarBookResults.flat();
  const filteredSimilarBooks = similarBooks.filter((b) => b.id !== book.id);

  const uniqueSimilarBooks = [
    ...new Map(filteredSimilarBooks.map((book) => [book.id, book])).values(),
  ];

  return uniqueSimilarBooks.slice(0, 10);
}
