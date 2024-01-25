import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Get all users

export async function GET(request: Request, { query }: any) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (name == null) {
    const categories = await prisma.category.groupBy({
      by: ["name", "id"],
      _count: true,
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json({ categories: categories });
  } else {
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
    return NextResponse.json({ categories: categories });
  }
}
// Create new users

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const category = await prisma.category.create({
      data,
    });
    return NextResponse.json({ category: category });
  } catch (error: any) {
    const { code, meta } = error;

    if (code == "P2002") {
      return new Response(
        JSON.stringify({ message: "category already exist" }),
        {
          status: 500,
        }
      );
    }
  }
}
