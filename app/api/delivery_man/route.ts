import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Get all users



export async function POST(request: Request, { query }: any) {
  const data = await request.json();
  try {
    const newDeliveryMan = await prisma.deliveryMan.create({
      data: {
        name: data.name,
        phone: data.phone,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });

    console.log(newDeliveryMan);
    
    return NextResponse.json({ newDeliveryMan: newDeliveryMan });
  } catch (error) {
    console.error("Error creating delivery man:", error);
  }
}
