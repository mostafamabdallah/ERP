import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Get all users



export async function POST(request: Request, { query }: any) {
  const data = await request.json();

  console.log(data);
  
  try {
    const employee = await prisma.employees.create({
      data: {
        name: data.name,
        phone: data.phone,
        job: data.job,
      },
    });

    return NextResponse.json({ employee: employee });
  } catch (error) {
    console.error("Error creating delivery man:", error);
  }
}
