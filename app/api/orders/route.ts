import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Get all users
// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");
//   const orders = await prisma.customer.findUnique({
//     where: {
//       id: Number(id),
//     },
//     include: {
//       orders: {
//         include: {
//           items: {
//             include: { item: true },
//           },
//         },
//       },
//     },
//   });
//   return NextResponse.json({ orders: orders });
// }
// // Create New Order
// export async function POST(request: Request) {
//   const data = await request.json();
//   try {
//     const newOrder = await prisma.order.create({
//       data: {
//         customerId: Number(data.customerID),
//         items: {
//           create: data.items.map((item: any) => ({
//             item: { connect: { id: item.id } },
//             quantity: item.quantity,
//           })),
//         },
//         delivery: Number(data.deliveryCost),
//       },
//       include: {
//         items: {
//           include: {
//             item: true,
//           },
//         },
//       },
//     });
//     return NextResponse.json({ newOrder: newOrder });
//   } catch (error: any) {
//     console.log(error);
//     const { code, meta } = error;
//     const message = meta?.cause?.message || "Internal server error";
//     return NextResponse.json({ code, message });
//   }
// }
