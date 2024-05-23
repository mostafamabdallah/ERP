-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryManId_fkey" FOREIGN KEY ("deliveryManId") REFERENCES "DeliveryMan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
