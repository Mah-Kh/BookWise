-- CreateTable
CREATE TABLE "BookContent" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "fullText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookChunk" (
    "id" SERIAL NOT NULL,
    "contentId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookContent_bookId_key" ON "BookContent"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "BookChunk_contentId_index_key" ON "BookChunk"("contentId", "index");

-- AddForeignKey
ALTER TABLE "BookContent" ADD CONSTRAINT "BookContent_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookChunk" ADD CONSTRAINT "BookChunk_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "BookContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
