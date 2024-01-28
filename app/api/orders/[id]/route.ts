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
