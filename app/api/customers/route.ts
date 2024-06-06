import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Get all users

export async function GET(request: Request) {
  const customers = await prisma.customer.findMany({
    include: {
      _count: {
        select: { orders: true },
      },
    },
    orderBy: {
      orders: {
        _count: 'desc',
      },
    },
  });

  return NextResponse.json({
    customers: customers,
  });
}
export async function POST(request: Request) {
  const data = await request.json();
  try {
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        status: "verified",
        type: data.type,
      },
    });

    return NextResponse.json({ customer: customer });
  } catch (error: any) {
    const { code, meta } = error;
    console.log(code);

    if (code == "P2002") {
      return new Response(
        JSON.stringify({ message: "Customer already exist" }),
        {
          status: 500,
        }
      );
    }
  }
}

export async function PUT(request: Request) {
  const data = await request.json();
  try {
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        status: "verified",
        type: data.type,
      },
    });

    return NextResponse.json({ customer: customer });
  } catch (error: any) {
    const { code, meta } = error;

    if (code == "P2002") {
      return new Response(
        JSON.stringify({ message: "Customer already exist" }),
        {
          status: 500,
        }
      );
    }
  }
}
