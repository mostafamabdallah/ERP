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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const customer = await prisma.customer.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      orders: {
        include: {
          items: {
            include: { item: true },
          },
        },
      },
    },
  });
  return NextResponse.json({ customer: customer });
}
// Create New Order
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  try {
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: Number(params.id),
        deliveryCost: data.deliveryCost,
        orderDetails: data.orderDetails,
        employeeId: data.deliveryMan,
        status: "pending",
        items: {
          create: data.items?.map((el: any) => ({
            item: { connect: { id: Number(el.id) } },
            quantity: el.quantity,
          })),
        },
      },
      include: {
        employee: true,
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
