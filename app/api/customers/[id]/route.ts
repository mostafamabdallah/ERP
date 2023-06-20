import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const customers = await prisma.customer.findMany();

  return NextResponse.json({ customer: customers });
}
