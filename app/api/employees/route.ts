import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request, context: any) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type) {
    const employees: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "Employees" WHERE job='delivery'`
    );
    return NextResponse.json({ employees });
  } else {
    const employees: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "Employees"`
    );
    return NextResponse.json({ employees });
  }
}

export async function POST(request: Request, { query }: any) {
  const data = await request.json();
  try {
    const result: any[] = await prisma.$queryRawUnsafe(
      `INSERT INTO "Employees" (name, phone, job, "nationalId", commission, salary, "isActive")
       VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING *`,
      data.name,
      data.phone,
      data.job,
      data.nationalId ?? null,
      data.commission != null ? Number(data.commission) : 30,
      data.salary != null ? Number(data.salary) : 0
    );
    return NextResponse.json({ employee: result[0] });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ message: "Error creating employee" }, { status: 500 });
  }
}
