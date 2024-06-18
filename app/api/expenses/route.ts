import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany();
    return NextResponse.json(expenses);
  } catch (error) {
    console.log(error);
    
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
    });  }
}

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const expense = await prisma.expense.create({
      data: {
        amount: data.amount,
        type: data.type,
        description: data.description,
      },
    });
    return NextResponse.json(expense);
  } catch (error: any) {
    const { code, meta } = error;
    console.log(error);
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
}
