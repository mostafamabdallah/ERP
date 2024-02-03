import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { NextResponse } from "next/server";

export async function GET() {
  try {
    let ordersPerDay = await prisma.$queryRawUnsafe(
      "SELECT CAST(DATE(create_at) AS CHAR) AS day, CAST(COUNT(*) AS CHAR) AS orderCount FROM `order` GROUP BY day"
    );

    return NextResponse.json({ ordersPerDay: ordersPerDay });
  } catch (error) {
    console.log(error);
  }
}
