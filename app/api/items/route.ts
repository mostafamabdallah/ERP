import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Get all users

export async function GET(request: Request) {
  const items = await prisma.item.findMany({
    include: {
      OrdersItesm: true,
    },
  });
  return NextResponse.json({ items: items });
}
// Create new users

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const item = await prisma.item.create({
      data: { ...data },
    });
    return NextResponse.json({ item: item });
  } catch (error: any) {
    const { code, meta } = error;
    const message = meta?.cause?.message || "Internal server error";
    return NextResponse.json({ code, message }, { status: 500 });
  }
}
