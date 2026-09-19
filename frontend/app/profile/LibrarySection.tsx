"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getLibrary,
  updateReadingStatus,
  updateFavorite,
  removeFromLibrary,
  type LibraryBook,
  type ReadingStatus,
} from "@/services/libraryService";

const statusLabels: Record<ReadingStatus, string> = {
  WANT_TO_READ: "Want to Read",
  READING: "Reading",
  COMPLETED: "Completed",
};

export default function LibrarySection() {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [filter, setFilter] = useState<"ALL" | ReadingStatus | "FAVORITES">(
    "ALL",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLibrary = useCallback(async () => {
    try {
      setError("");
      const result = await getLibrary();
      setBooks(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load library");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLibrary();
  }, [loadLibrary]);

  async function changeStatus(bookId: number, status: ReadingStatus) {
    try {
      const updated = await updateReadingStatus(bookId, status);
      setBooks((current) =>
        current.map((item) =>
          item.bookId === bookId ? { ...item, ...updated } : item,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function toggleFavorite(bookId: number, current: boolean) {
    try {
      const updated = await updateFavorite(bookId, !current);
      setBooks((items) =>
        items.map((item) =>
          item.bookId === bookId ? { ...item, ...updated } : item,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function removeBook(bookId: number) {
    try {
      await removeFromLibrary(bookId);
      setBooks((items) => items.filter((item) => item.bookId !== bookId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const visibleBooks = books.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "FAVORITES") return item.isFavorite;
    return item.status === filter;
  });

  if (loading) {
    return <p className="mt-6 text-sm text-muted">Loading library...</p>;
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">My Library</h2>

      <div className="mt-5 flex flex-wrap gap-2">
        {(
          ["ALL", "WANT_TO_READ", "READING", "COMPLETED", "FAVORITES"] as const
        ).map((value) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-full border px-4 py-2 text-sm ${
              filter === value
                ? "border-accent-strong bg-accent-soft"
                : "border-border"
            }`}
          >
            {value === "ALL"
              ? "All"
              : value === "FAVORITES"
                ? "Favorites"
                : statusLabels[value]}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-highlight-strong">
          {error}
        </p>
      )}

      {visibleBooks.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No books in this section yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {visibleBooks.map((item) => (
            <article
              key={item.bookId}
              className="rounded-2xl border border-border p-5"
            >
              <h3 className="font-semibold">
                {item.book?.title ?? "Unknown book"}
              </h3>

              <label className="mt-4 block text-xs text-muted">
                Reading status
              </label>
              <select
                value={item.status}
                onChange={(e) =>
                  void changeStatus(
                    item.bookId,
                    e.target.value as ReadingStatus,
                  )
                }
                className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  onClick={() =>
                    void toggleFavorite(item.bookId, item.isFavorite)
                  }
                  className="text-sm underline"
                >
                  {item.isFavorite ? "♥ Remove favorite" : "♡ Add favorite"}
                </button>

                <button
                  onClick={() => void removeBook(item.bookId)}
                  className="text-sm text-highlight-strong underline"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
