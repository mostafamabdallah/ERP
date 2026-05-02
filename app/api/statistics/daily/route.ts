import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import moment from "moment";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  // Date boundaries are kept as plain UTC calendar days — consistent with
  // how every other stat in this codebase works (ordersPerDay, moneyPerDay, etc.).
  const date = dateParam ? moment(dateParam, "YYYY-MM-DD") : moment();
  const startDate = date.clone().startOf("day").toDate();
  const endDate = date.clone().endOf("day").toDate();

  try {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      include: {
        customer: true,
        employee: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const expenses = await prisma.expense.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
    });

    const stats = {
      total: orders.length,
      delivered: orders.filter((o) =>
        ["delivered", "success"].includes(o.status)
      ).length,
      collected: orders.filter((o) =>
        ["collected", "moneyCollected"].includes(o.status)
      ).length,
      pending: orders.filter((o) => o.status === "pending").length,
      failed: orders.filter((o) => o.status === "failed").length,
    };

    const revenue = orders.reduce((sum, o) => sum + o.deliveryCost, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = revenue - totalExpenses;

    // ordersPerHour is intentionally NOT computed here.
    // The frontend derives it from `orders.createdAt` using the browser's local
    // timezone — the same way the orders table column formats its dates — so
    // the two always agree without any server-side timezone guesswork.
    return NextResponse.json({
      stats,
      revenue,
      expenses: totalExpenses,
      netProfit,
      orders,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch daily statistics" },
      { status: 500 }
    );
  }
}
