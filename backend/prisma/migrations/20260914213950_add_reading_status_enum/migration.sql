/*
  Warnings:

  - The `status` column on the `UserBook` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('WANT_TO_READ', 'READING', 'COMPLETED');

-- AlterTable
ALTER TABLE "UserBook" DROP COLUMN "status",
ADD COLUMN     "status" "ReadingStatus" NOT NULL DEFAULT 'WANT_TO_READ';
