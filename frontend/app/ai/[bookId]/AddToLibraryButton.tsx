"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addOpenLibraryBookToLibrary } from "@/services/libraryService";

type Props = {
  title: string;
  externalId: string;
};

export default function AddToLibraryButton({ title, externalId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleAdd() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await addOpenLibraryBookToLibrary({
        id: externalId,
        title,
        authors: [],
      });

      setMessage("Book added to your library!");
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong.";

      if (
        errorMessage.toLowerCase().includes("already") ||
        errorMessage.toLowerCase().includes("exists")
      ) {
        setMessage("This book is already in your library.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleAdd}
        disabled={loading}
        className="rounded-full bg-accent-strong px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add to My Library"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-green-700" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-highlight-strong" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
