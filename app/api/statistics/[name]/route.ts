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
      // Return UTC hours (0-23) so the frontend can shift to browser local time.
      // AT TIME ZONE 'UTC' on a TIMESTAMPTZ normalises to UTC regardless of the
      // database session timezone, giving a stable baseline for the client shift.
      let whereClause = "";
      if (Number(month)) {
        whereClause = `WHERE EXTRACT(MONTH FROM "create_at" AT TIME ZONE 'UTC') = ${month}
                         AND EXTRACT(YEAR  FROM "create_at" AT TIME ZONE 'UTC') = ${year}`;
      } else if (year) {
        whereClause = `WHERE EXTRACT(YEAR FROM "create_at" AT TIME ZONE 'UTC') = ${year}`;
      }
      let ordersPerHour = await prisma.$queryRawUnsafe(
        `SELECT EXTRACT(HOUR FROM "create_at" AT TIME ZONE 'UTC')::int AS hour,
                COUNT(*)::text AS order_count
         FROM "Order"
         ${whereClause}
         GROUP BY hour
         ORDER BY hour`
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
      // Build a date filter for orders so the ranking reflects the selected period.
      let orderWhere: any = {};
      if (Number(month)) {
        const startDate = moment(`${year}-${month}`, "YYYY-MM").startOf("month").toDate();
        const endDate   = moment(startDate).endOf("month").toDate();
        orderWhere = { createdAt: { gte: startDate, lt: endDate } };
      } else if (year) {
        const startDate = moment(`${year}`, "YYYY").startOf("year").toDate();
        const endDate   = moment(startDate).endOf("year").toDate();
        orderWhere = { createdAt: { gte: startDate, lt: endDate } };
      }

      const topCustomers = await prisma.customer.findMany({
        select: {
          id: true,
          name: true,
          type: true,
          _count: {
            select: { orders: { where: orderWhere } },
          },
        },
        orderBy: {
          orders: { _count: "desc" },
        },
        take: 10,
      });

      // Filter out customers with zero orders in the period when a filter is active.
      const filtered = (Number(month) || year)
        ? topCustomers.filter((c) => c._count.orders > 0)
        : topCustomers;

      return NextResponse.json({ topCustomers: filtered });
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
  } else if (param == "monthlyFinancials") {
    try {
      const targetYear = year || new Date().getFullYear().toString();

      const revenueRows: any[] = await prisma.$queryRawUnsafe(
        `SELECT EXTRACT(MONTH FROM "create_at")::int AS month,
                COALESCE(SUM("deliveryCost"), 0)::float AS revenue
         FROM "Order"
         WHERE EXTRACT(YEAR FROM "create_at") = ${targetYear}
         GROUP BY month
         ORDER BY month`
      );

      const expenseRows: any[] = await prisma.$queryRawUnsafe(
        `SELECT EXTRACT(MONTH FROM date)::int AS month,
                COALESCE(SUM(amount), 0)::float AS expenses
         FROM "Expense"
         WHERE EXTRACT(YEAR FROM date) = ${targetYear}
         GROUP BY month
         ORDER BY month`
      );

      const revenueMap: Record<number, number> = {};
      revenueRows.forEach((r) => { revenueMap[r.month] = Number(r.revenue); });

      const expenseMap: Record<number, number> = {};
      expenseRows.forEach((e) => { expenseMap[e.month] = Number(e.expenses); });

      const months = Array.from({ length: 12 }, (_, i) => {
        const m = i + 1;
        const revenue = revenueMap[m] ?? 0;
        const expenses = expenseMap[m] ?? 0;
        return { month: m, revenue, expenses, grossProfit: revenue - expenses };
      });

      return NextResponse.json({ monthlyFinancials: months });
    } catch (error) {
      console.log(error);
    }
  } else if (param == "expensesByCategory") {
    try {
      let whereClause = "";
      if (Number(month)) {
        whereClause = `WHERE EXTRACT(YEAR FROM date) = ${year} AND EXTRACT(MONTH FROM date) = ${month}`;
      } else if (year) {
        whereClause = `WHERE EXTRACT(YEAR FROM date) = ${year}`;
      }

      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT type, COALESCE(SUM(amount), 0)::float AS total
         FROM "Expense"
         ${whereClause}
         GROUP BY type
         ORDER BY total DESC`
      );

      return NextResponse.json({
        expensesByCategory: rows.map((r) => ({
          type: r.type,
          total: Number(r.total),
        })),
      });
    } catch (error) {
      console.log(error);
    }
  }
}
