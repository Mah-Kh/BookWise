"use client";

import Link from "next/link";
import type { Book } from "@/types/book";

export default function BookCard({ book }: { book: Book }) {
  const handleBookSelect = (id: string) => {
    localStorage.setItem("currentBook", id);
  };

  return (
    <Link
      href={`/ai/${book.id}`}
      onClick={() => handleBookSelect(book.id)}
      className="group block"
    >
      <div className="overflow-hidden rounded-2xl bg-surface-soft">
        <div className="aspect-[2/3] w-full">
          <div className="flex h-full items-center justify-center p-8">
            <span className="text-center text-sm font-medium text-subtle">
              Book Cover
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="line-clamp-2 text-base font-semibold leading-6 tracking-tight text-foreground transition-opacity group-hover:opacity-70">
          {book.title}
        </h2>

        <p className="mt-1 line-clamp-1 text-sm text-muted">
          {book.authors.join(", ")}
        </p>

        <p className="mt-2 text-xs text-subtle">{book.firstPublishYear}</p>
      </div>
    </Link>
  );
}
