# Bookwise — Read With Me

Bookwise is a full-stack reading companion that lets readers discover books, manage a personal library, and ask questions about book content using a local AI-powered Retrieval-Augmented Generation (RAG) pipeline.

## Features

- **Book discovery:** Search book metadata through the Open Library API.
- **Authentication:** Register and sign in with password hashing and JWT-based authentication.
- **Personal library:** Add and remove books, update reading status, and manage favorites.
- **AI book chat:** Ask questions about books whose full text is available for ingestion.
- **RAG pipeline:** Clean text, split it into chunks, generate embeddings, retrieve relevant passages, and use them as context for AI responses.
- **AI capabilities:** Structured outputs and tool-calling experiments using the AI SDK.
- **Local AI models:** Ollama is used for language generation and embeddings, without requiring a paid model API.

## Tech Stack

| Area           | Technologies                                   |
| -------------- | ---------------------------------------------- |
| Frontend       | Next.js, React, TypeScript, Tailwind CSS       |
| Backend        | NestJS, TypeScript, REST API                   |
| Database       | PostgreSQL, Prisma ORM 7                       |
| Authentication | JWT, password hashing, route guards            |
| AI / RAG       | AI SDK, Ollama, `llama3.2`, `nomic-embed-text` |
| Book data      | Open Library, Project Gutenberg via Gutendex   |

## Architecture

```text
Browser → Next.js → NestJS REST API → PostgreSQL
                              └──────→ Ollama

Book metadata → Open Library
Book full text → Gutendex → Text cleaning → Chunking
             → Embeddings → PostgreSQL → Retrieval → LLM response
```

## Local Development

### Prerequisites

- Node.js and npm
- PostgreSQL
- [Ollama](https://ollama.com/) with the models used by the application

Pull the local models if they are not already installed:

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

### Backend

1. Create a PostgreSQL database for the project.
2. Configure `backend/.env` with the database connection, JWT secret, and backend port. For local frontend integration, the API is expected at `http://localhost:3001`.

   Example values (replace the credentials and secret for your environment):

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/bookwise"
   JWT_SECRET="replace-with-a-long-random-secret"
   PORT=3001
   ```

3. Install dependencies, generate the Prisma client, apply the project's migrations, and start the API:

   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run start:dev
   ```

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser. The frontend's local API configuration expects the backend at `http://localhost:3001`.

## Current Scope and Limitations

- Open Library provides metadata, not guaranteed downloadable full text. AI chat is available only when a compatible full-text source can be found and ingestion completes successfully.
- Book text is currently sourced through Gutendex, so not every book returned by search can be used for AI chat.
- Embeddings are currently stored in PostgreSQL as JSON. Moving similarity search to `pgvector` is a planned improvement.

## Project Structure

```text
bookwise/
├── frontend/   # Next.js application
└── backend/    # NestJS API, Prisma schema/migrations, AI and ingestion services
```

## Roadmap

- Improve shared API error handling and frontend session-state management.
- Add clearer ingestion status and retry feedback in the UI.
- Migrate embedding storage and similarity search to `pgvector`.
- Expand automated end-to-end coverage.
