/*
  Warnings:

  - A unique constraint covering the columns `[student_id,session_id]` on the table `student_attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "student_attendance_student_id_session_id_key" ON "public"."student_attendance"("student_id", "session_id");
