import type {
  Book,
  BookMetadata,
  OpenLibraryAuthorReference,
  OpenLibraryWork,
} from "@/types/book";

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

type OpenLibraryAuthor = {
  name: string;
};

const normalizeBookDescription = (
  description: string | { type: string; value: string } | undefined,
) => {
  if (!description) return "";

  return typeof description === "string" ? description : description.value;
};

async function getAuthorName(
  authorReference: OpenLibraryAuthorReference,
): Promise<string | null> {
  const response = await fetch(
    `https://openlibrary.org${authorReference.author.key}.json`,
  );

  if (!response.ok) {
    return null;
  }

  const author: OpenLibraryAuthor = await response.json();

  return author.name;
}

export async function getBookById(bookId: string): Promise<BookMetadata> {
  const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch book: ${response.status}`);
  }

  const bookData: OpenLibraryWork = await response.json();

  const authorReferences = bookData.authors ?? [];

  const authorNames = await Promise.all(authorReferences.map(getAuthorName));

  const authors = authorNames.filter((name): name is string => name !== null);

  return {
    title: bookData.title,
    authors,
    description: normalizeBookDescription(bookData.description),
    subjects: bookData.subjects ?? [],
  };
}

export async function searchOpenLibraryBooks(
  query: string,
  limit: number = 5,
): Promise<Book[]> {
  const booksResultsLimit = limit > 100 ? 100 : limit;

  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${booksResultsLimit}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to search books: ${response.status}`);
  }
  const data: OpenLibrarySearchResponse = await response.json();
  return data.docs.map((book) => ({
    id: book.key.replace(/^\/works\//, ""),
    title: book.title,
    authors: book.author_name,
    firstPublishYear: book.first_publish_year,
    coverId: book.cover_i,
  }));
}
