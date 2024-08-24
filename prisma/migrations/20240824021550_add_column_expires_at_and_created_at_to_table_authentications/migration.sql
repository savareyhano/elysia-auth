/*
  Warnings:

  - Added the required column `expires_at` to the `authentications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "authentications" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;
