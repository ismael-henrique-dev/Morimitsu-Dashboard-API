/*
  Warnings:

  - Made the column `ifce_enrollment` on table `students` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."students" ALTER COLUMN "ifce_enrollment" SET NOT NULL,
ALTER COLUMN "ifce_enrollment" SET DATA TYPE TEXT;
