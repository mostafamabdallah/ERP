-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `type` VARCHAR(20) NULL,
    `create_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Customer_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNumber` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `deliveryCost` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `create_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `unit` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Item_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `itemId` INTEGER NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemOrder` (
    `orderId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`orderId`, `itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryToItem` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoryToItem_AB_unique`(`A`, `B`),
    INDEX `_CategoryToItem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemOrder` ADD CONSTRAINT `ItemOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemOrder` ADD CONSTRAINT `ItemOrder_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToItem` ADD CONSTRAINT `_CategoryToItem_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToItem` ADD CONSTRAINT `_CategoryToItem_B_fkey` FOREIGN KEY (`B`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
