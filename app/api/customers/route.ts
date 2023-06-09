import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Get all users

export async function GET(request: Request) {
  const customers = await prisma.customer.findMany({
    include: {
      orders: true,
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
        phone: "01146384940",
        status: "vallid",
        orders: {
          create: {
            items: {
              create: {
                name: "rice",
                price: 50,
              },
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
