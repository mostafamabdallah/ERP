/*
  Warnings:

  - You are about to alter the column `create_at` on the `customer` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `customer` MODIFY `create_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `OrdersItems` (
    `orderId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `customerId` INTEGER NULL,
    `quantity` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`orderId`, `itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrdersItems` ADD CONSTRAINT `OrdersItems_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdersItems` ADD CONSTRAINT `OrdersItems_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
