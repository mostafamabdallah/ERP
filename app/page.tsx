"use client";
import { CustomLine } from "@/components/charts/CustomLine";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import moment from "moment";
import InfoCards from "@/components/dashboard/InfoCards";
import OrdersPerDay from "@/components/dashboard/OrdersPerDay";
import OrdersPerHour from "@/components/dashboard/OrdersPerHour";
export default function Home() {
  return (
    <main className="flex flex-col w-full gap-5">
      <InfoCards></InfoCards>
      <OrdersPerDay></OrdersPerDay>
      <OrdersPerHour></OrdersPerHour>
    </main>
  );
}
