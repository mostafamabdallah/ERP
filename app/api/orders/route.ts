import { PrismaClient } from "@prisma/client";

import { NextResponse } from "next/server";
function generateOrderNumber() {
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, ""); // Format: YYYYMMDDHHmmss
  const randomSuffix = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0"); // Random 4-digit number

  return `ORD-${timestamp}-${randomSuffix}`;
}
const prisma = new PrismaClient();
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const search = (searchParams.get("search") || "").trim();
  const skip = (page - 1) * limit;

  const numericId = parseInt(search);
  const searchWhere = search
    ? {
        OR: [
          ...(Number.isInteger(numericId) && numericId > 0 ? [{ id: numericId }] : []),
          { customer: { name: { contains: search, mode: "insensitive" as const } } },
          { customer: { phone: { contains: search, mode: "insensitive" as const } } },
          { customer: { address: { contains: search, mode: "insensitive" as const } } },
          { employee: { name: { contains: search, mode: "insensitive" as const } } },
          { status: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [orders, total, statusGroups] = await Promise.all([
    prisma.order.findMany({
      where: searchWhere,
      include: { customer: {}, employee: {} },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where: searchWhere }),
    prisma.order.groupBy({ by: ["status"], _count: { id: true } }),
  ]);

  const statsMap: Record<string, number> = {};
  for (const g of statusGroups) statsMap[g.status] = g._count.id;

  const stats = {
    total: Object.values(statsMap).reduce((sum, v) => sum + v, 0),
    delivered: (statsMap["success"] || 0) + (statsMap["money_collected"] || 0),
    pending: statsMap["pending"] || 0,
    failed: statsMap["failed"] || 0,
  };

  return NextResponse.json({ orders, total, stats });
}
export async function POST(request: Request) {
  const data = await request.json();

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: Number(data.customerId),
        deliveryCost: data.deliveryCost,
        orderDetails: data.orderDetails,
        status: "pending",
        items: {
          create: data.items?.map((el: any) => ({
            item: { connect: { id: Number(el.id) } },
            quantity: el.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    return NextResponse.json({ order: order });
  } catch (error: any) {
    console.log(error);
    const { code, meta } = error;
    const message = meta?.cause?.message || "Internal server error";
    return NextResponse.json({ code, message });
  }
}
