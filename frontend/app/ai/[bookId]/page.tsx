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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 sm:px-10 lg:px-12">
      <div className="grid flex-1 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section className="max-w-xl">
          <div className="aspect-[2/3] w-full max-w-sm overflow-hidden rounded-2xl bg-surface-soft">
            <div className="flex h-full items-center justify-center p-8">
              <span className="text-center text-sm font-medium text-subtle">
                Book Cover
              </span>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">
              Reading with AI
            </p>

            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-4xl">
              {bookDetails.title}
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-muted">
              {bookDetails.description}
            </p>
          </div>
        </section>
        <section className="flex min-h-[600px] flex-col">
          <AiChat bookId={bookId} />
        </section>
      </div>
    </main>
  );
}
