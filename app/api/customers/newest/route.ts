import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      type: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return NextResponse.json({ customers });
}
