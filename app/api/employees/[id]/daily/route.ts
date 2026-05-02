import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import moment from "moment";

const prisma = new PrismaClient();

export async function GET(request: Request, context: any) {
  const id = context.params.id;
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  const date = dateParam ? moment(dateParam, "YYYY-MM-DD") : moment();
  const startDate = date.clone().startOf("day").toDate();
  const endDate = date.clone().endOf("day").toDate();

  try {
    const employee = await prisma.employees.findUnique({
      where: { id: Number(id) },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    const DELIVERED_STATUSES = ["success", "money_collected", "collected", "delivered"];

    const orders = await prisma.order.findMany({
      where: {
        employeeId: Number(id),
        createdAt: { gte: startDate, lte: endDate },
      },
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    });

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) =>
      DELIVERED_STATUSES.includes(o.status)
    ).length;
    const failedOrders = orders.filter((o) => o.status === "failed").length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const totalDeliveryMoney = orders.reduce((sum, o) => sum + o.deliveryCost, 0);
    const successRate =
      totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

    const commissionRate = employee.commission ?? 30;
    const commissionEarnings = (totalDeliveryMoney * commissionRate) / 100;

    return NextResponse.json({
      employee,
      stats: {
        totalOrders,
        deliveredOrders,
        failedOrders,
        pendingOrders,
        totalDeliveryMoney,
        successRate,
        commissionEarnings,
        commissionRate,
      },
      orders,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch daily stats" }, { status: 500 });
  }
}
