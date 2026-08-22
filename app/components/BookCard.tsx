import type { Book } from "@/types/book";

export default function BookCard({ book }: { book: Book }) {
  return (
    <div>
      <h2>{book.title}</h2>
      <p>Authors: {book.authors.join(", ")}</p>
      <p>First Published: {book.firstPublishYear}</p>
      <p>Cover ID: {book.coverId}</p>
    </div>
  );
}
