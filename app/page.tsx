"use client";
import InfoCards from "@/components/dashboard/InfoCards";
import OrdersPerDay from "@/components/dashboard/OrdersPerDay";
import OrdersPerHour from "@/components/dashboard/OrdersPerHour";
import MoneyPerDay from "@/components/dashboard/MoneyPerDay";
import TopCustomers from "@/components/TopCustomers";
import { DatePicker, Form } from "antd";
import { useState } from "react";
import { Moment } from "moment";

const { MonthPicker } = DatePicker;

interface SelectedMonth {
  month: number;
  year: number;
}

export default function Home() {
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<SelectedMonth | null>({
    month: 0,
    year: currentYear,
  });

  const handleMonthChange = (date: any | null, dateString: string) => {
    if (date) {
      const month = date.month() + 1; // month is zero-indexed
      const year = date.year();
      setSelectedMonth({ month, year });
    } else {
      setSelectedMonth(null);
    }
  };

  return (
    <main className="flex flex-col w-full gap-5">
      <MonthPicker onChange={handleMonthChange} />
      <InfoCards selectedMonth={selectedMonth} />
      <OrdersPerDay selectedMonth={selectedMonth} />
      <MoneyPerDay selectedMonth={selectedMonth} />
      <div className="flex flex-wrap gap-5 mb-5">
        <TopCustomers selectedMonth={selectedMonth} />
        <OrdersPerHour selectedMonth={selectedMonth} />
      </div>
    </main>
  );
}
