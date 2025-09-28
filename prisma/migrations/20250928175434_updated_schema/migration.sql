/*
  Warnings:

  - You are about to drop the `Announcement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Graduation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Belt" AS ENUM ('white', 'gray', 'yellow', 'orange', 'green', 'blue', 'purple', 'brown', 'black', 'red', 'coral', 'red_black');

-- DropForeignKey
ALTER TABLE "public"."Announcement" DROP CONSTRAINT "Announcement_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Attendance" DROP CONSTRAINT "Attendance_class_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Attendance" DROP CONSTRAINT "Attendance_instructor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Attendance" DROP CONSTRAINT "Attendance_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Class" DROP CONSTRAINT "Class_instructor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Graduation" DROP CONSTRAINT "Graduation_student_id_fkey";

-- DropTable
DROP TABLE "public"."Announcement";

-- DropTable
DROP TABLE "public"."Attendance";

-- DropTable
DROP TABLE "public"."Class";

-- DropTable
DROP TABLE "public"."Graduation";

-- DropTable
DROP TABLE "public"."Student";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."students" (
    "id" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "belt" "public"."Belt" NOT NULL,
    "grade" INTEGER NOT NULL,
    "current_frequency" INTEGER NOT NULL DEFAULT 0,
    "total_frequency" INTEGER NOT NULL DEFAULT 0,
    "email" TEXT NOT NULL,
    "class_id" TEXT,
    "ifce_enrollment" INTEGER,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."personal_info" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "parent_name" TEXT NOT NULL,
    "parent_phone" TEXT NOT NULL,
    "student_phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."announcements" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."AnnouncementType" NOT NULL,
    "reference_date" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."graduations" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "graduation_date" TIMESTAMP(3) NOT NULL,
    "belt" "public"."Belt" NOT NULL,
    "grade" INTEGER NOT NULL,

    CONSTRAINT "graduations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age_range" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "instructor_id" TEXT NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."class_sessions" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "instructor_id" TEXT NOT NULL,
    "session_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_attendance" (
    "id" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL DEFAULT false,
    "student_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,

    CONSTRAINT "student_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "public"."students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "personal_info_student_id_key" ON "public"."personal_info"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_info_cpf_key" ON "public"."personal_info"("cpf");

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."personal_info" ADD CONSTRAINT "personal_info_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."announcements" ADD CONSTRAINT "announcements_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."graduations" ADD CONSTRAINT "graduations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "classes_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."class_sessions" ADD CONSTRAINT "class_sessions_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."class_sessions" ADD CONSTRAINT "class_sessions_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_attendance" ADD CONSTRAINT "student_attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_attendance" ADD CONSTRAINT "student_attendance_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."class_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
