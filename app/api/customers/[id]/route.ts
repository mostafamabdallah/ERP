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

export async function POST(request: Request, context: any) {
  const data = await request.json();
  try {
    const updatedCustomer = await prisma.customer.update({
      where: {
        id: data.id,
      },
      data: {
        status: data.status,
      },
    });
    return NextResponse.json({ customer: updatedCustomer });
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(request: Request, context: any) {
  const data = await request.json();
  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id: Number(context.params.id) },
      data: data,
    });
    return NextResponse.json({ customer: updatedCustomer });
  } catch (error) {
    console.log(error);
  }
}





