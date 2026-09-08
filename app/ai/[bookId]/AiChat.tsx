"use client";

import React, { useState } from "react";
import AiSpark from "../../components/AiSpark";
import AiTypingText from "../../components/AiTypingText";

const AI_CHAT_MESSAGES = [
  "Something on your mind?",
  "Have a thought about this book?",
  "Looking for a book-loving friend to share your ideas with",
  "Curious about a certain topic?",
];

const AI_THINKING_MESSAGES = ["Thinking..."];

type ChatMessage = {
  role: "user" | "ai";
  content: string;
};

export default function AiChat({ bookId }: { bookId: string }) {
  const [userMessage, setUserMessage] = useState("");

  // Keep the full conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const message = userMessage.trim();

    if (message === "") {
      setError("Please enter a question.");
      return;
    }

    setError(null);
    setUserMessage("");

    // Add the user's new message to the existing conversation
    setMessages((currentMessages) => [
      ...currentMessages.filter(
        (item) => !(item.role === "user" && item.content === ""),
      ),
      { role: "user", content: message },
    ]);

    try {
      setIsLoading(true);

      const response = await fetch("/api/dev/rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: message,
        }),
      });

      if (response.ok) {
        const apiResponse = await response.json();

        // Add the AI response to the existing conversation.
        setMessages((currentMessages) => [
          ...currentMessages,
          { role: "ai", content: apiResponse.answer },
        ]);
      } else {
        // setError("Failed to get a response from the AI.");
        const errorData = await response.json().catch(() => null);

        console.error("RAG API error:", response.status, errorData);

        setError(errorData?.error ?? `AI request failed: ${response.status}`);
      }
    } catch {
      setError("Something went wrong while contacting the AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-[600px] flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-start gap-3">
          <AiSpark />

          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              AI reading companion
            </h2>

            <p className="mt-1 max-w-md text-xs leading-5 text-muted">
              Discuss ideas, characters, themes, or anything you are curious
              about.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {!error &&
        (messages.length === 0 ||
          (messages.length === 1 && messages[0].content === "")) ? (
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center -translate-y-8">
            <div className="scale-150">
              <AiSpark />
            </div>

            <p className="mt-8 max-w-2xl text-center text-2xl font-semibold leading-[1.45] tracking-[-0.02em] text-subtle sm:text-3xl">
              I’m here to hear your thoughts
              <br />
              Any idea, question, or perspective
              <br />
              Let’s talk about this book together
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[80%] rounded-2xl bg-accent-soft px-4 py-3"
                    : "max-w-[80%] rounded-2xl bg-surface-soft px-4 py-3"
                }
              >
                <p className="text-sm leading-7 text-foreground">
                  {message.content}
                </p>
              </div>
            ))}

            {isLoading && (
              <div className="max-w-[80%] rounded-2xl bg-surface-soft px-4 py-3">
                <span className="text-sm text-muted">
                  <AiTypingText messages={AI_THINKING_MESSAGES} />
                </span>
              </div>
            )}

            {error && (
              <p className="max-w-[80%] rounded-xl bg-highlight/20 px-4 py-3 text-sm leading-6 text-highlight-strong">
                {error}
              </p>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-border p-4">
        <div className="flex gap-3">
          <div className="relative min-w-0 flex-1">
            {/* Show the animated placeholder only before the conversation starts*/}
            {!userMessage && messages.length === 0 && !isInputFocused && (
              <div className="pointer-events-none absolute inset-y-0 left-5 z-10 flex items-center text-sm text-placeholder">
                <AiTypingText messages={AI_CHAT_MESSAGES} />
              </div>
            )}

            <input
              value={userMessage}
              placeholder=""
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onChange={(e) => setUserMessage(e.target.value)}
              className="w-full rounded-full border border-border bg-surface px-5 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 cursor-pointer rounded-full bg-accent-strong px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {!isLoading ? "Send" : "Thinking..."}
          </button>
        </div>
      </form>
    </div>
  );
}
