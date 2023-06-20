/*
  Warnings:

  - You are about to alter the column `create_at` on the `customer` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `categorycategory` on the `item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customer` MODIFY `create_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `item` DROP COLUMN `categorycategory`,
    ADD COLUMN `category` VARCHAR(191) NULL;
