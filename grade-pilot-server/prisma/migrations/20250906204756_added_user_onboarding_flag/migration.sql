/*
  Warnings:

  - You are about to drop the column `authenticated` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "authenticated",
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
