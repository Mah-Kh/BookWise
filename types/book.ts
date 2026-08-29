export type Book = {
  id: string;
  title: string;
  authors: string[];
  firstPublishYear?: number;
  coverId?: number;
};

export type BookMetadata = {
  title: string;
  description: string;
  subjects: string[];
};

export type OpenLibraryWork = {
  title: string;
  description?: string | { type: string; value: string };
  subjects?: string[];
};
