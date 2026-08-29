import type { BookMetadata, OpenLibraryWork } from "@/types/book";

const normalizeBookDescription = (
  des: string | { type: string; value: string } | undefined,
) => {
  if (!des) return "";
  return typeof des === "string" ? des : des.value;
};

export async function getBookById(bookId: string): Promise<BookMetadata> {
  const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch book: ${response.status}`);
  }
  const bookData: OpenLibraryWork = await response.json();

  const bookMetadata: BookMetadata = {
    title: bookData.title,
    description: normalizeBookDescription(bookData.description),
    subjects: bookData.subjects ?? [],
  };

  return bookMetadata;
}
