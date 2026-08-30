import { getBookById } from "@/services/openLibraryService";

type BookResult = {
  title: string;
  formats?: {
    "text/plain; charset=utf-8"?: string;
  };
};

type GutendexResponse = {
  results: BookResult[];
};

export type EnrichedBook = {
  title: string;
  authors: string[];
  description: string;
  subjects: string[];
  bookText: string;
};

const MAX_BOOK_CONTEXT_LENGTH = 4000;

export async function enrichBook(bookId: string): Promise<EnrichedBook> {
  const bookMetadata = await getBookById(bookId);

  const response = await fetch(
    `https://gutendex.com/books/?search=${encodeURIComponent(bookMetadata.title)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Gutendex data: ${response.status}`);
  }

  const gutendexData: GutendexResponse = await response.json();

  const bookResult = gutendexData.results.find(
    (result) => result.title.toLowerCase() === bookMetadata.title.toLowerCase(),
  );

  if (!bookResult) {
    throw new Error(
      `No information found for "${bookMetadata.title}" in Gutendex`,
    );
  }

  const textUrl = bookResult.formats?.["text/plain; charset=utf-8"];

  if (!textUrl) {
    throw new Error(`No plain text available for "${bookMetadata.title}"`);
  }

  const textResponse = await fetch(textUrl);

  if (!textResponse.ok) {
    throw new Error(`Failed to fetch text for "${bookMetadata.title}"`);
  }

  const bookText = await textResponse.text();

  let cleanedText = bookText;

  const startIndex = bookText.indexOf(
    "*** START OF THE PROJECT GUTENBERG EBOOK",
  );
  const endIndex = bookText.indexOf("*** END OF THE PROJECT GUTENBERG EBOOK");

  if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
    cleanedText = bookText
      .slice(
        startIndex + "*** START OF THE PROJECT GUTENBERG EBOOK".length,
        endIndex,
      )
      .trim();
  }

  const bookContext =
    cleanedText.length > MAX_BOOK_CONTEXT_LENGTH
      ? cleanedText.slice(0, MAX_BOOK_CONTEXT_LENGTH)
      : cleanedText;

  return {
    title: bookMetadata.title,
    authors: bookMetadata.authors,
    description: bookMetadata.description,
    subjects: bookMetadata.subjects,
    bookText: bookContext,
  };
}
