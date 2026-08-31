import { getBookById } from "@/services/openLibraryService";
import { getSimilarBooks } from "@/services/similarBooksService";
import AiChat from "../[bookId]/AiChat";

export default async function AiBookPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;

  const bookDetails = await getBookById(bookId);
  const currentBook = {
    id: bookId,
    title: bookDetails.title,
    authors: bookDetails.authors,
  };

  const similarBooks = await getSimilarBooks(currentBook);
  return (
    <>
      <p>{bookId}</p>
      <p>{bookDetails.title}</p>
      <p>{bookDetails.description}</p>
      <AiChat bookId={bookId} />
      <p>Similar books</p>
      <ul>
        {similarBooks.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </>
  );
}
