import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Get all users

export async function GET(request: Request) {
  const customerWithOrders = await prisma.customer.findMany({
    include: {
      orders: {
        include: {
          items: true,
        },
      },
    },
  });
  return NextResponse.json({ customerWithOrders: customerWithOrders });
}
// Create new users

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const newOrder = await prisma.order.create({
      data: {
        customerId: Number(data.customerID),
        items: {
          connect: data.item.map((el: any, i: number) => {
            return { id: el.id };
          }),
        },
        delivary: Number(data.delivaryCost),
      },
      include: {
        items: true,
      },
    });
    return NextResponse.json({ newOrder: newOrder });
  } catch (error: any) {
    console.log(error);
    const { code, meta } = error;
    const message = meta?.cause?.message || "Internal server error";
    return NextResponse.json({ code, message });
  }
}
