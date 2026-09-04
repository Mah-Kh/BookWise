import Link from "next/link";
import AiReadingCompanion from "./components/AiReadingCompanion";

const HOME_AI_MESSAGES = [
  "Looking for something to read?",
  "Curious about a certain topic?",
  "Want to discover books that match your mood?",
  "Something on your mind?",
];

export default function Home() {
  return (
    <main className="flex w-full flex-1 bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 sm:px-10 lg:px-12">
        <div className="pt-2">
          <AiReadingCompanion messages={HOME_AI_MESSAGES} />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-6xl md:text-7xl">
            Read With Me
          </h1>

          <p className="text-lg leading-8 text-muted">
            Think deeper. Discuss more. With your AI companion.
          </p>

          <div className="mt-10">
            <Link
              href="/library"
              className="inline-flex items-center rounded-full bg-accent-strong px-6 py-3 text-sm font-medium text-white"
            >
              Go to Library
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
