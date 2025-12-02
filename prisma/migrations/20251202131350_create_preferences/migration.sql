-- CreateEnum
CREATE TYPE "public"."GraduationCategory" AS ENUM ('kids', 'infanto_juvenil', 'juvenil_adulto');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."Belt" ADD VALUE 'gray_white';
ALTER TYPE "public"."Belt" ADD VALUE 'gray_black';
ALTER TYPE "public"."Belt" ADD VALUE 'yellow_white';
ALTER TYPE "public"."Belt" ADD VALUE 'yellow_black';
ALTER TYPE "public"."Belt" ADD VALUE 'orange_white';
ALTER TYPE "public"."Belt" ADD VALUE 'orange_black';
ALTER TYPE "public"."Belt" ADD VALUE 'green_white';
ALTER TYPE "public"."Belt" ADD VALUE 'green_black';

-- CreateTable
CREATE TABLE "public"."graduation_preferences" (
    "id" TEXT NOT NULL,
    "category" "public"."GraduationCategory" NOT NULL,
    "belt" "public"."Belt" NOT NULL,
    "min_age" INTEGER,
    "max_age" INTEGER,
    "total_trainings" INTEGER NOT NULL,

    CONSTRAINT "graduation_preferences_pkey" PRIMARY KEY ("id")
);
