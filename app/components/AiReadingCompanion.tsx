import AiSpark from "./AiSpark";
import AiTypingText from "../components/AiTypingText";

type AiReadingCompanionProps = {
  messages: string[];
};

export default function AiReadingCompanion({
  messages,
}: AiReadingCompanionProps) {
  return (
    <div className="w-[320px] max-w-full">
      <div className="flex items-center gap-2">
        <AiSpark />

        <span className="bg-brand-gradient bg-clip-text text-transparent">
          <span className="relative inline-block font-mono text-lg font-bold tracking-[0.02em]">
            <span className="absolute -inset-x-1 -inset-y-0.5 -z-10 rounded bg-accent/45" />
            AI
          </span>{" "}
          <span className="font-semibold">reading companion</span>
        </span>
      </div>

      <div className="mt-2 h-0.5 w-full bg-highlight-strong" />

      <div className="mt-3 flex h-8 w-full items-center rounded-md bg-surface px-3 shadow-sm ring-1 ring-border">
        <span className="min-w-0 overflow-hidden whitespace-nowrap text-sm text-muted">
          <AiTypingText messages={messages} />
        </span>
      </div>
    </div>
  );
}
