/*
  Warnings:

  - Added the required column `source` to the `BookContent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "BookContent" ADD COLUMN     "error" TEXT,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "fullText" DROP NOT NULL;
