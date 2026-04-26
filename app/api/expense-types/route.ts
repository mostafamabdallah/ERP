import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const expenseTypes = await prisma.expenseType.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(expenseTypes);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch expense types" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.nameAr?.trim() || !data.nameEn?.trim()) {
      return NextResponse.json(
        { message: "Both Arabic and English names are required" },
        { status: 400 }
      );
    }

    const expenseType = await prisma.expenseType.create({
      data: {
        nameAr: data.nameAr.trim(),
        nameEn: data.nameEn.trim(),
      },
    });
    return NextResponse.json(expenseType, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create expense type" },
      { status: 500 }
    );
  }
}
