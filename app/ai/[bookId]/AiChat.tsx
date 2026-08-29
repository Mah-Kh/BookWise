"use client";
import React, { useState } from "react";
import type { OllamaResponse } from "@/types/ai";

export default function AiChat({ bookId }: { bookId: string }) {
  const [userMessage, setUserMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setAiResponse("");
    setError(null);
    if (userMessage.trim() === "") {
      setError("Please enter a question.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          message: userMessage,
        }),
      });
      if (response.ok) {
        const apiResponse: OllamaResponse = await response.json();
        setAiResponse(apiResponse.response);
        setUserMessage("");
      } else {
        setError("Failed to get a response from the AI.");
      }
    } catch {
      setError("Something went wrong while contacting the AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          value={userMessage}
          placeholder="Ask something about this book..."
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {!isLoading ? "Send" : "Thinking..."}
        </button>
      </form>
      <div>{aiResponse}</div>
    </div>
  );
}
