import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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
      where: { id: Number(id) },
      data: {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
      },
    });
    return NextResponse.json({ employee: updatedEmployee });
  }

  if (type == "update_commission") {
    const updatedEmployee = await prisma.employees.update({
      where: { id: Number(id) },
      data: { commission: Number(data.commission) },
    });
    return NextResponse.json({ employee: updatedEmployee });
  }

  if (type == "update_employee") {
    await prisma.$executeRawUnsafe(
      `UPDATE "Employees" SET name=$1, phone=$2, job=$3, "nationalId"=$4, salary=$5 WHERE id=$6`,
      data.name,
      data.phone,
      data.job,
      data.nationalId ?? null,
      data.salary != null ? Number(data.salary) : 0,
      Number(id)
    );
    const updated: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "Employees" WHERE id=$1`,
      Number(id)
    );
    return NextResponse.json({ employee: updated[0] });
  }

  if (type == "toggle_status") {
    await prisma.$executeRawUnsafe(
      `UPDATE "Employees" SET "isActive" = NOT "isActive" WHERE id=$1`,
      Number(id)
    );
    const updated: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "Employees" WHERE id=$1`,
      Number(id)
    );
    return NextResponse.json({ employee: updated[0] });
  }
}
