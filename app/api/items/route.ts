import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Get all users

export async function GET(request: Request, { query }: any) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (name == null) {
    const items = await prisma.item.findMany({});
    return NextResponse.json({ items: items });
  } else {
    const items = await prisma.item.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
    return NextResponse.json({ items: items });
  }
}
// Create new users

export async function POST(request: Request) {
  const data = await request.json();

  console.log({
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    unit: data.unit,
  });

  try {
    const item = await prisma.item.create({
      data: {
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        unit: data.unit,
        categories: {
          create: {
            name: data.category,
          },
        },
      },
    });
    return NextResponse.json({ item: item });
  } catch (error: any) {
    const { code, meta } = error;

    if (code == "P2002") {
      return new Response(JSON.stringify({ message: "Item already exist" }), {
        status: 500,
      });
    }
  }
}
