/*
  Warnings:

  - You are about to alter the column `create_at` on the `customer` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[name]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `customer` MODIFY `create_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `item` MODIFY `price` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Item_name_key` ON `Item`(`name`);
