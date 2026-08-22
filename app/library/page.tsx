import { Book } from "@/types/book";
import { getOpenLibraryBooks } from "@/services/openLibraryService";
import SearchForm from "../components/SearchForm";
import BookCard from "../components/BookCard";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string | undefined }>;
}) {
  const search = (await searchParams).q ?? "";

  let openLibraryBooks: Book[] = [];
  let error: string | null = null;

  if (search) {
    try {
      // openLibraryBooks = await getOpenLibraryBooks("the hobbit", 500);
      openLibraryBooks = await getOpenLibraryBooks(search, 5);
    } catch (err) {
      error = err instanceof Error ? err.message : "Something went wrong";
    }
  }

  return (
    <main>
      <h1>Library</h1>
      <SearchForm
        action="/library"
        search={search}
        placeholder="Search for a book"
      />
      {!search ? (
        <p>Search for a book to get started.</p>
      ) : error ? (
        <p>{error}</p>
      ) : openLibraryBooks.length === 0 ? (
        <p>"No books found."</p>
      ) : (
        <>
          <p>Found {openLibraryBooks.length} books.</p>
          {openLibraryBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </>
      )}
    </main>
  );
}
