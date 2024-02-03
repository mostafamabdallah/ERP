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
  const orders = await prisma.order.findMany({
    include: {
      customer: {},
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json({ orders: orders });
}
// Create New Order
export async function POST(request: Request) {
  const data = await request.json();
  try {
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: Number(data.customerId),
        deliveryCost: data.deliveryCost,
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
