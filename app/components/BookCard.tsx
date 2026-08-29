"use client";

import Link from "next/link";
import type { Book } from "@/types/book";

export default function BookCard({ book }: { book: Book }) {
  const handleBookSelect = (id: string) => {
    localStorage.setItem("currentBook", id);
  };

  return (
    <Link href={`/ai/${book.id}`} onClick={() => handleBookSelect(book.id)}>
      <h2>{book.title}</h2>
      <p>Authors: {book.authors.join(", ")}</p>
      <p>First Published: {book.firstPublishYear}</p>
      <p>Cover ID: {book.coverId}</p>
    </Link>
  );
}
