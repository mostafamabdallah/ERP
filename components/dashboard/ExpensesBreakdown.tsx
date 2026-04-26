import React from "react";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import { useLanguage } from "@/contexts/LanguageContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import CountUp from "react-countup";

ChartJS.register(ArcElement, Tooltip, Legend);

type CategoryRow = { type: string; total: number };
type ExpenseType = { id: number; nameAr: string; nameEn: string };

type Props = {
  selectedMonth: { month: number; year: number } | null;
};

const CATEGORY_COLORS = [
  { bg: "#0f62fe80", border: "#0f62fe" },
  { bg: "#ef444480", border: "#ef4444" },
  { bg: "#f59e0b80", border: "#f59e0b" },
  { bg: "#8b5cf680", border: "#8b5cf6" },
  { bg: "#22c55e80", border: "#22c55e" },
  { bg: "#ec489980", border: "#ec4899" },
  { bg: "#14b8a680", border: "#14b8a6" },
];

const ExpensesBreakdown = ({ selectedMonth }: Props) => {
  const { t, language } = useLanguage();
  const year = selectedMonth?.year ?? new Date().getFullYear();
  const month = selectedMonth?.month ?? 0;

  const { data = [], isLoading } = useQuery<CategoryRow[]>({
    queryKey: ["expensesByCategory", selectedMonth],
    queryFn: () =>
      customFetch
        .get(`statistics/expensesByCategory?year=${year}&month=${month}`)
        .then((res) => res.data.expensesByCategory),
    initialData: [],
  });

  const { data: expenseTypes = [] } = useQuery<ExpenseType[]>({
    queryKey: ["expense-types"],
    queryFn: () => customFetch.get("expense-types").then((res) => res.data),
  });

  const typeMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    expenseTypes.forEach((et) => {
      map[et.nameAr] = language === "ar" ? et.nameAr : et.nameEn;
    });
    return map;
  }, [expenseTypes, language]);

  const labels = data.map((d) => typeMap[d.type] ?? d.type);
  const totals = data.map((d) => d.total);
  const grandTotal = totals.reduce((s, v) => s + v, 0);

  const chartData = {
    labels,
    datasets: [
      {
        data: totals,
        backgroundColor: data.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length].bg),
        borderColor: data.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length].border),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const, labels: { boxWidth: 12, padding: 10 } },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const pct = grandTotal > 0 ? ((ctx.parsed / grandTotal) * 100).toFixed(1) : "0";
            return ` ${ctx.label}: ${Number(ctx.parsed).toLocaleString()} ج.م (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-3 px-6 py-4 bg-white dark:bg-surface-mid rounded-lg transition-colors duration-300">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 dark:text-on-surface-variant font-bold text-lg">
          {t.dashboard.expensesByCategory}
        </span>
        <span className="text-sm text-gray-400 dark:text-on-surface-variant">
          {month ? `${month}/${year}` : year}
        </span>
      </div>

      {/* Total expenses summary */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-gray-400 dark:text-on-surface-variant">{t.dashboard.totalExpenses}</span>
        <span className="text-2xl font-bold text-red-500">
          <CountUp end={grandTotal} separator="," suffix=" ج.م" />
        </span>
      </div>

      {/* Fixed-height chart area */}
      <div className="relative h-52">
        {!isLoading && data.length > 0 ? (
          <Doughnut data={chartData} options={options} />
        ) : !isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            لا توجد مصروفات مسجلة
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading...
          </div>
        )}
      </div>

      {/* Category breakdown list */}
      {!isLoading && data.length > 0 && (
        <div className="flex flex-col gap-1">
          {data.map((row, i) => {
            const pct = grandTotal > 0 ? ((row.total / grandTotal) * 100).toFixed(1) : "0";
            const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length].border;
            return (
              <div key={row.type} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-600 dark:text-on-surface-variant" dir="rtl">
                    {typeMap[row.type] ?? row.type}
                  </span>
                </div>
                <span className="font-semibold text-gray-700 dark:text-on-surface">
                  {row.total.toLocaleString()} ج.م
                  <span className="text-gray-400 ms-1">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpensesBreakdown;
