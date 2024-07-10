import { PrismaClient } from "@prisma/client";

import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const order = await prisma.order.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      customer: {},
      items: {
        include: {
          item: {},
        },
      },
      employee: true,
    },
  });
  return NextResponse.json({ order: order });
}

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const updatedOrder = await prisma.order.update({
      where: {
        id: data.id,
      },
      data: {
        status: data.status,
      },
    });
    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(request: Request) {
  const data = await request.json();
  try {
    await prisma.itemOrder.deleteMany({
      where: {
        orderId: data.id,
      },
    });

    const deletedOrder = await prisma.order.delete({
      where: {
        id: data.id,
      },
    });
    return NextResponse.json({ order: deletedOrder });
  } catch (error) {
    console.log(error);
  }
}

export async function DELETE(request: Request) {
  const data = await request.json();
  try {
    // Find the order in the database
    const order = await prisma.order.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!order) {
      // If order with the given ID doesn't exist, return 404 Not Found
      NextResponse.json({ mes: "Order not found" });
    }

    // Delete the order
    await prisma.order.delete({
      where: {
        id: data.id,
      },
    });

    // Return success response
    return NextResponse.json({ mes: "order deleted successfully" });
  } catch (error) {
    // If any error occurs during database operation, return 500 Internal Server Error
    console.error("Error deleting order:", error);
    return NextResponse.json({ mes: "internal server error" });
  }
}
