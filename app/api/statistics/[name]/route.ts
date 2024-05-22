import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
  let param = context.params.name;

  if (param == "ordersPerDay") {
    try {
      let ordersPerDay = await prisma.$queryRawUnsafe(
        `SELECT DATE("create_at") AS order_date, COUNT(*)::text AS order_count FROM "Order" GROUP BY DATE("create_at") ORDER BY order_date;`
      );

      return NextResponse.json({ ordersPerDay: ordersPerDay });
    } catch (error) {
      console.log(error);
    }
  } else if (param == "totalDeliveryMoney") {
    try {
      const orders = await prisma.order.findMany();

      // Calculate the total delivery cost
      const totalDeliveryCost = orders.reduce((total, order) => {
        return total + order.deliveryCost;
      }, 0);

      return NextResponse.json({ totalDeliveryCost: totalDeliveryCost });
    } catch (error) {
      console.log(error);
    }
  } else if (param == "ordersPerHour") {
    try {
      let ordersPerHour = await prisma.$queryRawUnsafe(
        `SELECT EXTRACT(HOUR FROM "create_at") as hour, COUNT(*) as order_count FROM "Order" GROUP BY hour ORDER BY hour;`
      );
      return NextResponse.json({ ordersPerHour: ordersPerHour });
    } catch (error) {
      console.log(error);
    }
  }
}
