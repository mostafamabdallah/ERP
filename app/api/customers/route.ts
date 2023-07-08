import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Get all users

export async function GET(request: Request) {
  const customers = await prisma.customer.findMany({});
  return NextResponse.json({
    customers: customers});
}
export async function POST(request: Request) {
  const data = await request.json();
  
  try {
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        adress: data.adress,
        phone: data.phone,
        status: "verfied",
        type: data.type,
      },
    });

    return NextResponse.json({ customer: customer });
  } catch (error: any) {
    console.log(error);
    const { code, meta } = error;
    const message = meta?.cause?.message || "Internal server error";
    return NextResponse.json({ code, message });
  }
}
