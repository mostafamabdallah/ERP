import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import moment from "moment";

const prisma = new PrismaClient();

export async function GET(request: Request, context: any) {
  const id = context.params.id;
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  try {
    const employee = await prisma.employees.findUnique({
      where: { id: Number(id) },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    let whereClause: any = { employeeId: Number(id) };

    if (month && year && Number(month)) {
      const startDate = moment(`${year}-${month}`, "YYYY-MM")
        .startOf("month")
        .toDate();
      const endDate = moment(startDate).endOf("month").toDate();
      whereClause.createdAt = { gte: startDate, lt: endDate };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    });

    const DELIVERED_STATUSES = ["success", "money_collected", "collected", "delivered"];

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) =>
      DELIVERED_STATUSES.includes(o.status)
    ).length;
    const failedOrders = orders.filter((o) => o.status === "failed").length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const totalDeliveryMoney = orders.reduce((sum, o) => sum + o.deliveryCost, 0);
    const avgDeliveryMoney = totalOrders > 0 ? totalDeliveryMoney / totalOrders : 0;
    const successRate =
      totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

    const daysInMonth =
      month && year && Number(month)
        ? moment(`${year}-${month}`, "YYYY-MM").daysInMonth()
        : 30;
    const avgOrdersPerDay =
      daysInMonth > 0
        ? Math.round((deliveredOrders / daysInMonth) * 10) / 10
        : 0;

    return NextResponse.json({
      employee,
      stats: {
        totalOrders,
        deliveredOrders,
        failedOrders,
        pendingOrders,
        totalDeliveryMoney,
        avgDeliveryMoney,
        avgOrdersPerDay,
        successRate,
      },
      orders,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
