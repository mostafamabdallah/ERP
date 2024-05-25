import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Get all employees

export async function GET(request: Request, context: any) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type) {
    const employees = await prisma.employees.findMany({
      where: {
        job: "deliver man",
      },
    });

    return NextResponse.json({
      employees: employees,
    });
  } else {
    const employees = await prisma.employees.findMany({});

    return NextResponse.json({
      employees: employees,
    });
  }
}

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
