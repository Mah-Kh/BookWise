"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Book } from "@/types/book";

type Props = {
  subjects: string[];
  currentBookId: string;
};

export default function SimilarBooks({ subjects, currentBookId }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadRecommendations() {
      try {
        const subject = subjects.find(Boolean);

        if (!subject) {
          if (active) setBooks([]);
          return;
        }

        const response = await fetch(
          `https://openlibrary.org/search.json?subject=${encodeURIComponent(
            subject,
          )}&limit=8`,
        );

        if (!response.ok) {
          throw new Error("Failed to load recommendations");
        }

        const data = await response.json();

        const recommendations: Book[] = (data.docs ?? [])
          .map((item: any) => {
            const workId =
              typeof item.key === "string"
                ? item.key.replace("/works/", "")
                : null;

            if (!workId || !item.title) return null;

            return {
              id: workId,
              title: item.title,
              authors: item.author_name ?? [],
              firstPublishYear: item.first_publish_year,
              coverId: item.cover_i,
            };
          })
          .filter(Boolean)
          .filter((book: Book) => book.id !== currentBookId)
          .slice(0, 4);

        if (active) {
          setBooks(recommendations);
        }
      } catch {
        if (active) {
          setBooks([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRecommendations();

    return () => {
      active = false;
    };
  }, [subjects, currentBookId]);

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-foreground">Similar books</h2>
        <p className="mt-3 text-sm text-muted">Loading recommendations...</p>
      </section>
    );
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-foreground">Similar books</h2>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/ai/${book.id}`}
            className="group rounded-xl border border-border bg-background p-3 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-surface-soft">
              {book.coverId ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
                  alt={`Cover of ${book.title}`}
                  className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4">
                  <span className="text-center text-sm text-subtle">
                    No cover
                  </span>
                </div>
              )}
            </div>

            <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-foreground">
              {book.title}
            </h3>

            {book.authors?.[0] && (
              <p className="mt-1 line-clamp-1 text-xs text-muted">
                {book.authors[0]}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
