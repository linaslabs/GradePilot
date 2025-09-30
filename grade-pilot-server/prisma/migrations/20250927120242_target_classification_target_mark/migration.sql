/*
  Warnings:

  - You are about to drop the column `targetClassification` on the `AcademicYear` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."AcademicYear" DROP COLUMN "targetClassification",
ADD COLUMN     "targetMark" INTEGER;

-- DropEnum
DROP TYPE "public"."YearClassification";
