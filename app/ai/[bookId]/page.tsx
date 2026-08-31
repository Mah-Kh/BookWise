import { getBookById } from "@/services/openLibraryService";
import AiChat from "../[bookId]/AiChat";

export default async function AiBookPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;

  const bookDetails = await getBookById(bookId);

  return (
    <>
      <p>{bookId}</p>
      <p>{bookDetails.title}</p>
      <p>{bookDetails.description}</p>
      <AiChat bookId={bookId} />
    </>
  );
}
