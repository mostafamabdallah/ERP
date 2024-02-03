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
