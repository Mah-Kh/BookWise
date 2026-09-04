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

  // Similar-book searches can return results grouped in nested arrays,
  // so flatten them into one list before filtering and deduplicating.
  const similarBooks = similarBookResults.flat();
  const filteredSimilarBooks = similarBooks.filter((b) => b.id !== book.id);

  // Use the book ID as the Map key to keep only one entry per book.
  // Map keys are unique, so duplicate books with the same ID are overwritten.
  const uniqueSimilarBooks = [
    ...new Map(filteredSimilarBooks.map((book) => [book.id, book])).values(),
  ];

  return uniqueSimilarBooks.slice(0, 10);
}
