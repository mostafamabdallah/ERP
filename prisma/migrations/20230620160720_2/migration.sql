/*
  Warnings:

  - You are about to alter the column `create_at` on the `customer` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `customer` MODIFY `create_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `item` ADD COLUMN `unit` VARCHAR(191) NULL;
