export type Book = {
  id: string;
  title: string;
  authors: string[];
  firstPublishYear?: number;
  coverId?: number;
};

export type BookMetadata = {
  title: string;
  authors: string[];
  description: string;
  subjects: string[];
};

export type OpenLibraryAuthorReference = {
  author: {
    key: string;
  };
};

export type OpenLibraryWork = {
  title: string;
  description?: string | { type: string; value: string };
  subjects?: string[];
  authors?: OpenLibraryAuthorReference[];
};
