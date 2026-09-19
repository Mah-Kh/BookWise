import type { Book } from "@/types/book";

const API_URL = "http://localhost:3001";

export type ReadingStatus = "WANT_TO_READ" | "READING" | "COMPLETED";

export type LibraryBook = {
  id: number;
  bookId: number;
  status: ReadingStatus;
  isFavorite: boolean;
  book: {
    id: number;
    title: string;
    externalId: string | null;
  };
};

async function libraryRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Please log in first.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Library request failed");
  }

  return data as T;
}

export function getLibrary() {
  return libraryRequest<LibraryBook[]>("/library");
}

export function updateReadingStatus(bookId: number, status: ReadingStatus) {
  return libraryRequest<LibraryBook>(`/library/${bookId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function updateFavorite(bookId: number, isFavorite: boolean) {
  return libraryRequest<LibraryBook>(`/library/${bookId}/favorite`, {
    method: "PATCH",
    body: JSON.stringify({ isFavorite }),
  });
}

export function removeFromLibrary(bookId: number) {
  return libraryRequest<{ message: string }>(`/library/${bookId}`, {
    method: "DELETE",
  });
}

export async function addToLibrary(bookId: number) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch("http://localhost:3001/library", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to add book to library");
  }

  return data;
}

// export async function addOpenLibraryBookToLibrary(book: Book) {
//   const token = localStorage.getItem("accessToken");

//   if (!token) {
//     throw new Error("Please log in first.");
//   }

//   // Create or retrieve the internal Bookwise record
//   const bookResponse = await fetch(`${API_URL}/books`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       title: book.title,
//       externalId: book.id,
//     }),
//   });

//   const savedBook = await bookResponse.json();

//   if (!bookResponse.ok) {
//     throw new Error(savedBook.message ?? "Could not save book.");
//   }

//   // Add using the internal database ID
//   const libraryResponse = await fetch(`${API_URL}/library`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       bookId: savedBook.id,
//     }),
//   });

//   const libraryData = await libraryResponse.json();

//   if (!libraryResponse.ok) {
//     throw new Error(libraryData.message ?? "Could not add book to library.");
//   }

//   return libraryData;
// }

export async function addOpenLibraryBookToLibrary(book: Book) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("STEP 0: Please log in first.");
  }

  let bookResponse: Response;

  try {
    bookResponse = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: book.title,
        externalId: book.id,
      }),
    });
  } catch {
    throw new Error("STEP 1: Failed to connect to POST /books.");
  }

  const bookData = await bookResponse.json();

  if (!bookResponse.ok) {
    throw new Error(
      `STEP 1: /books failed: ${
        Array.isArray(bookData.message)
          ? bookData.message.join(", ")
          : (bookData.message ?? "Unknown error")
      }`,
    );
  }

  const savedBook = bookData;

  let libraryResponse: Response;

  try {
    libraryResponse = await fetch(`${API_URL}/library`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookId: savedBook.id,
      }),
    });
  } catch {
    throw new Error("STEP 2: Failed to connect to POST /library.");
  }

  const libraryData = await libraryResponse.json();

  if (!libraryResponse.ok) {
    throw new Error(
      `STEP 2: /library failed: ${
        Array.isArray(libraryData.message)
          ? libraryData.message.join(", ")
          : (libraryData.message ?? "Unknown error")
      }`,
    );
  }

  return libraryData;
}
