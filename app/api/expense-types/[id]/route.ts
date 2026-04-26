import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    if (!data.nameAr?.trim() || !data.nameEn?.trim()) {
      return NextResponse.json(
        { message: "Both Arabic and English names are required" },
        { status: 400 }
      );
    }

    const expenseType = await prisma.expenseType.update({
      where: { id },
      data: {
        nameAr: data.nameAr.trim(),
        nameEn: data.nameEn.trim(),
      },
    });
    return NextResponse.json(expenseType);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update expense type" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma.expenseType.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete expense type" },
      { status: 500 }
    );
  }
}
