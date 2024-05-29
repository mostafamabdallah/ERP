import { PrismaClient } from "@prisma/client";
import moment from "moment";
export const maxDuration = 300
const prisma = new PrismaClient();
interface TotalMoneyPerDay {
  date: string;
  totalMoney: number;
}
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
        `SELECT TO_CHAR("create_at", 'HH AM') as hour, COUNT(*)::text as order_count FROM "Order" GROUP BY hour ORDER BY hour;`
      );
      return NextResponse.json({ ordersPerHour: ordersPerHour });
    } catch (error) {
      console.log(error);
    }
  } else if (param == "moneyPerDay") {
    try {
      const money = await prisma.$queryRaw<
        { date: string; deliveryCostSum: number; orderIds: number[] }[]
      >`
      SELECT  DATE("create_at") as date, 
          COALESCE(SUM("deliveryCost"), 0) as "cost"
        FROM "Order"
        GROUP BY DATE("create_at")`;
    

      return NextResponse.json({ moneyPerDay: money });
    } catch (error) {
      console.log(error);
    }
  }
}
