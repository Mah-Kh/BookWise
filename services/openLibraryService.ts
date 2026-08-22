import { Book } from "@/types/book";

type OpenLibrarySearchResponse = {
  numFound: number;
  docs: OpenLibraryBook[];
};

type OpenLibraryBook = {
  key: string;
  title: string;
  author_name: string[];
  first_publish_year?: number;
  cover_i?: number;
};

export async function getOpenLibraryBooks(
  name: string,
  limit: number = 5,
): Promise<Book[]> {
  const booksResultsLimit = limit > 100 ? 100 : limit;
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(name)}&limit=${booksResultsLimit}`,
  );
  const data: OpenLibrarySearchResponse = await response.json();

  const openLibraryBooks: Book[] = data.docs.map((book) => ({
    id: book.key,

    title: book.title,

    authors: book.author_name,

    firstPublishYear: book.first_publish_year,

    coverId: book.cover_i,
  }));

  return openLibraryBooks;
}
