/*
  Warnings:

  - You are about to drop the column `age_range` on the `classes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."classes" DROP COLUMN "age_range",
ADD COLUMN     "max_age" INTEGER,
ADD COLUMN     "min_age" INTEGER NOT NULL DEFAULT 4;

-- AlterTable
ALTER TABLE "public"."students" ALTER COLUMN "alias" DROP NOT NULL;
