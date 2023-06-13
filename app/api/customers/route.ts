import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Get all users

export async function GET(request: Request) {
  const customers = await prisma.customer.findMany({
    include: {
      orders: {
        include: {
          OrdersItesm: true,
        },
      },
    },
  });
  return NextResponse.json({ customers: customers });
}
// Create new users

export async function POST(request: Request) {
  try {
    const customers = await prisma.customer.create({
      data: {
        name: "mostafa mahmoud abdallah",
        adress: "13 street salah salem",
        phone: "0114638440044",
        status: "verfiy",
        orders: {
          create: {
            items: {
              connect: {},
            },
          },
        },
      },
    });
    return NextResponse.json({ customer: customers });
  } catch (error: any) {
    const { code, meta } = error;
    const message = meta?.cause?.message || "Internal server error";
    return NextResponse.json({ code, message });
  }
}
