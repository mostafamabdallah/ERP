import { PrismaClient } from "@prisma/client";
import moment from "moment";

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
      const ordersPerDay = await prisma.order.groupBy({
        by: ["createdAt"],
        _sum: {
          deliveryCost: true,
        },
        _count: true,
      });
      const result: TotalMoneyPerDay[] = [];
      for (let orderGroup of ordersPerDay) {
        const date = moment(orderGroup.createdAt).format("YYYY-MM-DD");
        // Get all order IDs from the orderGroup
        const orderIds = await prisma.order
          .findMany({
            where: {
              createdAt: orderGroup.createdAt,
            },
            select: {
              id: true,
            },
          })
          .then((orders) => orders.map((order) => order.id));
        const items = await prisma.itemOrder.findMany({
          where: {
            orderId: {
              in: orderIds,
            },
          },
          include: {
            item: true,
          },
        });
        let totalItemPrice = items.reduce((total, itemOrder) => {
          return total + itemOrder.quantity * itemOrder.item.price;
        }, 0);
        const totalMoney = (orderGroup._sum.deliveryCost ?? 0) + totalItemPrice;
        result.push({
          date,
          totalMoney,
        });
      }

      return NextResponse.json({ moneyPerDay: result });
    } catch (error) {
      console.log(error);
    }
  }
}
