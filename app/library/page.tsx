import type { Book } from "@/types/book";
import { searchOpenLibraryBooks } from "@/services/openLibraryService";
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
      // openLibraryBooks = await searchOpenLibraryBooks("the hobbit", 500);
      openLibraryBooks = await searchOpenLibraryBooks(search, 5);
    } catch (err) {
      error = err instanceof Error ? err.message : "Something went wrong";
    }
  }

  return (
    <main className="px-6 py-10 mx-auto w-full max-w-6xl">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 mb-6">
        Library
      </h1>
      <SearchForm
        action="/library"
        search={search}
        placeholder="Search for a book"
      />
      {!search ? (
        <p className="text-zinc-600">Search for a book to get started.</p>
      ) : error ? (
        <p className="text-zinc-600">{error}</p>
      ) : openLibraryBooks.length === 0 ? (
        <p className="text-zinc-600">No books found.</p>
      ) : (
        <>
          <p className="text-zinc-600 mb-6">
            Found {openLibraryBooks.length} books.
          </p>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {openLibraryBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
