"use client";
import { CustomLine } from "@/components/charts/CustomLine";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import moment from "moment";
import InfoCards from "@/components/dashboard/InfoCards";
import OrdersPerDay from "@/components/dashboard/OrdersPerDay";
import OrdersPerHour from "@/components/dashboard/OrdersPerHour";
import MoneyPerDay from "@/components/dashboard/MoneyPerDay";
import TopCustomers from "@/components/TopCustomers";
export default function Home() {
  return (
    <main className="flex flex-col w-full gap-5">
      <InfoCards></InfoCards>
      <OrdersPerDay></OrdersPerDay>
      <TopCustomers></TopCustomers>
      <MoneyPerDay></MoneyPerDay>
      <OrdersPerHour></OrdersPerHour>
    </main>
  );
}
