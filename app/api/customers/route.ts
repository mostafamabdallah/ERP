import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const search = (searchParams.get("search") || "").trim();
  const skip = (page - 1) * limit;

  const numericId = parseInt(search);
  const searchWhere = search
    ? {
        OR: [
          ...(Number.isInteger(numericId) && numericId > 0 ? [{ id: numericId }] : []),
          { name: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
          { address: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [customers, total, statusGroups] = await Promise.all([
    prisma.customer.findMany({
      where: searchWhere,
      include: { _count: { select: { orders: true } } },
      orderBy: { orders: { _count: "desc" } },
      skip,
      take: limit,
    }),
    prisma.customer.count({ where: searchWhere }),
    prisma.customer.groupBy({ by: ["status"], _count: { id: true } }),
  ]);

  const statsMap: Record<string, number> = {};
  for (const g of statusGroups) statsMap[g.status] = g._count.id;

  const stats = {
    total: Object.values(statsMap).reduce((sum, v) => sum + v, 0),
    verified: statsMap["verified"] || 0,
    warned: statsMap["warned"] || 0,
    blocked: statsMap["blocked"] || 0,
  };

  return NextResponse.json({ customers, total, stats });
}
export async function POST(request: Request) {
  const data = await request.json();
  try {
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        status: "verified",
        type: data.type,
      },
    });

    return NextResponse.json({ customer: customer });
  } catch (error: any) {
    const { code, meta } = error;
    if (code == "P2002") {
      return new Response(
        JSON.stringify({ message: "Customer already exist" }),
        {
          status: 500,
        }
      );
    }
  }
}

export async function PUT(request: Request) {
  const data = await request.json();
  try {
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        status: "verified",
        type: data.type,
      },
    });

    return NextResponse.json({ customer: customer });
  } catch (error: any) {
    const { code, meta } = error;

    if (code == "P2002") {
      return new Response(
        JSON.stringify({ message: "Customer already exist" }),
        {
          status: 500,
        }
      );
    }
  }
}
