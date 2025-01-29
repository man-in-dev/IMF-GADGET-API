/*
  Warnings:

  - You are about to drop the column `codename` on the `Gadget` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Gadget` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Gadget_codename_key";

-- AlterTable
ALTER TABLE "Gadget" DROP COLUMN "codename";

-- CreateIndex
CREATE UNIQUE INDEX "Gadget_name_key" ON "Gadget"("name");
