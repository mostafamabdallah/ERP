import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { NextResponse } from "next/server";

export async function GET() {
  try {
    let ordersPerDay = await prisma.$queryRawUnsafe(
      "SELECT TO_CHAR(create_at, 'YYYY-MM-DD') AS day, COUNT(*) AS orderCount FROM `order` GROUP BY TO_CHAR(create_at, 'YYYY-MM-DD')"
    );

    return NextResponse.json({ ordersPerDay: ordersPerDay });
  } catch (error) {
    console.log(error);
  }
}
