-- CreateTable
CREATE TABLE "public"."password_reset" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_reset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."password_reset" ADD CONSTRAINT "password_reset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
