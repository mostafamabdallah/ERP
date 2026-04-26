"use client";
import InfoCards from "@/components/dashboard/InfoCards";
import OrdersPerDay from "@/components/dashboard/OrdersPerDay";
import OrdersPerHour from "@/components/dashboard/OrdersPerHour";
import MoneyPerDay from "@/components/dashboard/MoneyPerDay";
import MonthlyFinancials from "@/components/dashboard/MonthlyFinancials";
import ExpensesBreakdown from "@/components/dashboard/ExpensesBreakdown";
import TopCustomers from "@/components/TopCustomers";
import { DatePicker } from "antd";
import { useState } from "react";

const { MonthPicker } = DatePicker;

interface SelectedMonth {
  month: number;
  year: number;
}

export default function Home() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<SelectedMonth | null>({
    month: 0,
    year: currentDate.getFullYear(),
  });

  const handleMonthChange = (date: any | null) => {
    if (date) {
      const month = date.month() + 1;
      const year = date.year();
      setSelectedMonth({ month, year });
    } else {
      setSelectedMonth({ month: 0, year: currentDate.getFullYear() });
    }
  };

  return (
    <main className="flex flex-col w-full gap-5 pb-8">
      {/* Month filter */}
      <MonthPicker onChange={handleMonthChange} />

      {/* KPI Summary Cards */}
      <InfoCards selectedMonth={selectedMonth} />

      {/* Monthly Financials: yearly revenue / expenses / gross profit */}
      <MonthlyFinancials selectedMonth={selectedMonth} />

      {/* Expenses breakdown + Orders per day side by side */}
      <div className="flex flex-wrap gap-5">
        <div className="flex-1 min-w-[300px]">
          <ExpensesBreakdown selectedMonth={selectedMonth} />
        </div>
        <div className="flex-1 min-w-[300px]">
          <OrdersPerDay selectedMonth={selectedMonth} />
        </div>
      </div>

      {/* Revenue per day line chart */}
      <MoneyPerDay selectedMonth={selectedMonth} />

      {/* Top customers + orders per hour */}
      <div className="flex flex-wrap gap-5 mb-5 items-stretch">
        <TopCustomers selectedMonth={selectedMonth} />
        <OrdersPerHour selectedMonth={selectedMonth} />
      </div>
    </main>
  );
}
