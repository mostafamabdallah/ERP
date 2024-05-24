/*
  Warnings:

  - You are about to drop the column `deliveryManId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `DeliveryMan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_deliveryManId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryManId",
ADD COLUMN     "employeeId" INTEGER;

-- DropTable
DROP TABLE "DeliveryMan";

-- CreateTable
CREATE TABLE "Employees" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "job" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
