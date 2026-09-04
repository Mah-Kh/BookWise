import type { Book } from "@/types/book";
import { searchOpenLibraryBooks } from "@/services/openLibraryService";
import SearchForm from "../components/SearchForm";
import BookCard from "../components/BookCard";
import AiSpark from "../components/AiSpark";

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
      openLibraryBooks = await searchOpenLibraryBooks(search, 5);
    } catch (err) {
      error = err instanceof Error ? err.message : "Something went wrong";
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-semibold leading-tight tracking-[-0.035em] text-foreground">
          Library
        </h1>

        <p className="mt-3 max-w-lg text-base leading-7 text-muted">
          Find a book and start reading with your AI companion.
        </p>

        <div className="mt-7">
          <SearchForm
            action="/library"
            search={search}
            placeholder="Search for a book"
          />
        </div>
      </div>

      <div className="mt-8 w-full max-w-xl rounded-2xl bg-surface-soft px-5 py-4">
        <div className="flex items-start gap-3">
          <AiSpark />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Not sure what to read?
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">
              Ask your AI companion to help you find your next book.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-4 cursor-pointer rounded-full bg-accent-strong px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Ask your companion
        </button>
      </div>

      {!search ? (
        <p className="mt-14 text-sm text-muted">
          Search for a book to get started.
        </p>
      ) : error ? (
        <p className="mt-14 text-sm text-muted">{error}</p>
      ) : openLibraryBooks.length === 0 ? (
        <p className="mt-14 text-sm text-muted">No books found.</p>
      ) : (
        <>
          <p className="mb-7 mt-12 text-sm text-muted">
            Found {openLibraryBooks.length} books.
          </p>

          <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {openLibraryBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
