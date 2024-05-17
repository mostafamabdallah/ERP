import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { NextResponse } from "next/server";

export async function GET() {
  
  try {
    let ordersPerDay = await prisma.$queryRawUnsafe(
      `SELECT
          DATE("create_at") AS order_date,
          COUNT(*) AS order_count
      FROM
          "Order"
      GROUP BY
          DATE("create_at")
      ORDER BY
          order_date;`
    );
  console.log(ordersPerDay);


    return NextResponse.json({ ordersPerDay: ordersPerDay });
  } catch (error) {
    console.log(error);
  }
}
