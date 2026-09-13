"use client";

import { useEffect, useState } from "react";

type AiTypingTextProps = {
  messages: string[];
};

export default function AiTypingText({ messages }: AiTypingTextProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const currentMessage = messages[messageIndex];

    if (isWaiting) {
      const timeout = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, 1800);

      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayedText.length < currentMessage.length) {
            setDisplayedText(currentMessage.slice(0, displayedText.length + 1));
          } else {
            setIsWaiting(true);
          }
        } else if (displayedText.length > 0) {
          setDisplayedText(currentMessage.slice(0, displayedText.length - 1));
        } else {
          setMessageIndex((index) => (index + 1) % messages.length);
          setIsDeleting(false);
        }
      },
      isDeleting ? 65 : 110,
    );

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, isWaiting, messageIndex, messages]);

  return (
    <>
      <span>{displayedText}</span>
      <span
        aria-hidden="true"
        className="ml-1 inline-block h-4 w-px translate-y-0.5 bg-accent-strong"
      />
    </>
  );
}
