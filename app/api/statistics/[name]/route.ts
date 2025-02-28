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
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (param == "ordersPerDay") {
    let ordersPerDay;
    try {
      if (Number(month)) {
        ordersPerDay = await prisma.$queryRawUnsafe(
          `SELECT DATE("create_at") AS order_date, COUNT(*)::text AS order_count
          FROM "Order"
          WHERE EXTRACT(MONTH FROM "create_at") = '${month}' AND EXTRACT(YEAR FROM "create_at") = '${year}'
          GROUP BY DATE("create_at")
          ORDER BY order_date;`
        );
      } else {
        ordersPerDay = await prisma.$queryRawUnsafe(
          `SELECT DATE("create_at") AS order_date, COUNT(*)::text AS order_count FROM "Order" GROUP BY DATE("create_at") ORDER BY order_date;`
        );
      }

      return NextResponse.json({ ordersPerDay: ordersPerDay });
    } catch (error) {
      console.log(error);
    }
  } else if (param == "totalDeliveryMoney") {
    try {
      let orders;
      if (Number(month)) {
        const startDate = moment(`${year}-${month}`, "YYYY-MM")
          .startOf("month")
          .toDate();
        const endDate = moment(startDate).endOf("month").toDate();
        orders = await prisma.order.findMany({
          where: {
            createdAt: {
              gte: startDate,
              lt: endDate,
            },
          },
        });
      } else {
        orders = await prisma.order.findMany({});
      }
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
      let money;
      if (!Number(month)) {
        money = await prisma.$queryRawUnsafe(
          `SELECT
          DATE("create_at") as date,
          COALESCE(SUM("deliveryCost"), 0) as "cost"
          FROM "Order"
          GROUP BY DATE("create_at")
          ORDER BY DATE("create_at")`
        );
      } else {
        money = await prisma.$queryRawUnsafe(
          `SELECT
          DATE("create_at") as date,
          COALESCE(SUM("deliveryCost"), 0) as "cost"
          FROM "Order"
          WHERE EXTRACT(MONTH FROM "create_at") = ${month} AND EXTRACT(YEAR FROM "create_at") = ${year}
          GROUP BY DATE("create_at")
          ORDER BY DATE("create_at")`
        );
      }
      return NextResponse.json({ moneyPerDay: money });
    } catch (error) {
      console.log(error);
    }
  } else if (param == "topCustomers") {
    try {
      const topCustomers = await prisma.customer.findMany({
        select: {
          id: true,
          name: true,
          type: true,
          _count: {
            select: { orders: true },
          },
        },
        orderBy: {
          orders: {
            _count: "desc",
          },
        },
        take: 10,
      });
      return NextResponse.json({ topCustomers: topCustomers });
    } catch (error) {
      console.log(error);
    }
  } else if (param == "netProfit") {
    try {
      let orders;
      let expense;
      if (Number(month)) {
        const startDate = moment(`${year}-${month}`, "YYYY-MM")
          .startOf("month")
          .toDate();
        const endDate = moment(startDate).endOf("month").toDate();
        orders = await prisma.order.findMany({
          where: {
            createdAt: {
              gte: startDate,
              lt: endDate,
            },
          },
        });
        expense = await prisma.expense.findMany({
          where: {
            date: {
              gte: startDate,
              lt: endDate,
            },
          },
        });
      } else {
        orders = await prisma.order.findMany({});
        expense = await prisma.expense.findMany({});
      }
      const totalDeliveryCost = orders.reduce((total, order) => {
        return total + order.deliveryCost;
      }, 0);
      const totalExpense = expense.reduce((total, expense) => {
        return total + expense.amount;
      }, 0);
      let netProfit = totalDeliveryCost - totalExpense;

      return NextResponse.json({
        netProfit,
        totalExpense,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
