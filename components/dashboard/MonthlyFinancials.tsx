import React from "react";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import CountUp from "react-countup";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type MonthData = {
  month: number;
  revenue: number;
  expenses: number;
  grossProfit: number;
};

type Props = {
  selectedMonth: { month: number; year: number } | null;
};

const MONTH_NAMES_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];
const MONTH_NAMES_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MonthlyFinancials = ({ selectedMonth }: Props) => {
  const { t, language } = useLanguage();
  const year = selectedMonth?.year ?? new Date().getFullYear();

  const { data = [], isLoading } = useQuery<MonthData[]>({
    queryKey: ["monthlyFinancials", year],
    queryFn: () =>
      customFetch
        .get(`statistics/monthlyFinancials?year=${year}`)
        .then((res) => res.data.monthlyFinancials),
    initialData: [],
  });

  const monthLabels = language === "ar" ? MONTH_NAMES_AR : MONTH_NAMES_EN;

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: t.dashboard.revenue,
        data: data.map((d) => d.revenue),
        backgroundColor: "#0f62fe80",
        borderColor: "#0f62fe",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: t.dashboard.totalExpenses,
        data: data.map((d) => d.expenses),
        backgroundColor: "#ef444480",
        borderColor: "#ef4444",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: t.dashboard.grossProfit,
        data: data.map((d) => d.grossProfit),
        backgroundColor: "#22c55e80",
        borderColor: "#22c55e",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.dataset.label}: ${Number(ctx.parsed.y).toLocaleString()} ج.م`,
        },
      },
    },
    scales: {
      y: { suggestedMin: 0, ticks: { callback: (v: any) => `${Number(v).toLocaleString()}` } },
    },
  };

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalExpenses = data.reduce((s, d) => s + d.expenses, 0);
  const totalGrossProfit = data.reduce((s, d) => s + d.grossProfit, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Summary mini-cards */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[160px] flex flex-col gap-1 px-5 py-3 bg-white dark:bg-surface-mid rounded-lg border-s-4 border-[#0f62fe] transition-colors duration-300">
          <span className="text-gray-500 dark:text-on-surface-variant text-sm font-semibold">
            {t.dashboard.revenue} ({year})
          </span>
          <span className="text-2xl font-bold text-[#0f62fe]">
            <CountUp end={totalRevenue} separator="," suffix=" ج.م" />
          </span>
        </div>
        <div className="flex-1 min-w-[160px] flex flex-col gap-1 px-5 py-3 bg-white dark:bg-surface-mid rounded-lg border-s-4 border-red-500 transition-colors duration-300">
          <span className="text-gray-500 dark:text-on-surface-variant text-sm font-semibold">
            {t.dashboard.totalExpenses} ({year})
          </span>
          <span className="text-2xl font-bold text-red-500">
            <CountUp end={totalExpenses} separator="," suffix=" ج.م" />
          </span>
        </div>
        <div className="flex-1 min-w-[160px] flex flex-col gap-1 px-5 py-3 bg-white dark:bg-surface-mid rounded-lg border-s-4 border-green-500 transition-colors duration-300">
          <span className="text-gray-500 dark:text-on-surface-variant text-sm font-semibold">
            {t.dashboard.grossProfit} ({year})
          </span>
          <span className={`text-2xl font-bold ${totalGrossProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
            <CountUp end={totalGrossProfit} separator="," suffix=" ج.م" />
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex flex-col gap-3 px-6 py-4 bg-white dark:bg-surface-mid rounded-lg w-full transition-colors duration-300">
        <span className="text-gray-500 dark:text-on-surface-variant font-bold text-lg">
          {t.dashboard.monthlyFinancials} — {year}
        </span>
        <div className="h-56">
          {!isLoading ? (
            <Bar options={{ ...options, responsive: true, maintainAspectRatio: false }} data={chartData} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyFinancials;
