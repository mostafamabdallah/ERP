import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Get all employees

export async function GET(request: Request, context: any) {
  let id = context.params.id;
  const employee = await prisma.employees.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      orders: true,
    },
  });
  return NextResponse.json({
    employee: employee,
  });
}

export async function PUT(request: Request, context: any) {
  const data = await request.json();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  let id = context.params.id;
  if (type == "update_location") {
    const updatedEmployee = await prisma.employees.update({
      where: {
        id: Number(id),
      },
      data: {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
      },
    });
    return NextResponse.json({
      employee: updatedEmployee,
    });
  }
}
