"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import { DatePicker, Table, Tag } from "antd";
import { useLanguage } from "@/contexts/LanguageContext";
import CountUp from "react-countup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faScaleBalanced,
  faCalendarCheck,
  faPercent,
  faArrowTrendUp,
  faBriefcase,
  faTriangleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const { MonthPicker } = DatePicker;

interface KpiCardProps {
  title: string;
  value: number;
  icon: any;
  iconColor: string;
  iconBgColor: string;
  isCurrency?: boolean;
  isProfit?: boolean;
  suffix?: string;
  decimals?: number;
  subtitle?: string;
}

const KpiCard = ({
  title,
  value,
  icon,
  iconColor,
  iconBgColor,
  isCurrency,
  isProfit,
  suffix = "",
  decimals = 0,
  subtitle,
}: KpiCardProps) => {
  const isNegative = isProfit && value < 0;
  return (
    <div className="flex-1 min-w-[160px] flex flex-col gap-3 px-5 py-4 bg-white dark:bg-surface-mid rounded-xl shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-start">
        <span className="text-gray-500 dark:text-on-surface-variant font-semibold text-sm leading-tight">
          {title}
        </span>
        <div
          className={`flex items-center justify-center ${iconBgColor} rounded-xl w-10 h-10 shrink-0`}
        >
          <FontAwesomeIcon className={`${iconColor} text-base`} icon={icon} />
        </div>
      </div>
      <span
        className={`text-2xl font-bold ${
          isProfit
            ? isNegative
              ? "text-red-500"
              : "text-green-500"
            : "text-tittle dark:text-on-surface"
        }`}
      >
        <CountUp
          end={value}
          separator=","
          decimals={decimals}
          suffix={isCurrency ? " ج.م" : suffix}
          duration={1.2}
        />
      </span>
      {subtitle && (
        <span className="text-xs text-gray-400 dark:text-on-surface-variant -mt-2">
          {subtitle}
        </span>
      )}
    </div>
  );
};

const Page = () => {
  const { t } = useLanguage();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["financial", selectedMonth.month, selectedMonth.year],
    queryFn: () =>
      customFetch
        .get(
          `financial?month=${selectedMonth.month}&year=${selectedMonth.year}`
        )
        .then((r) => r.data),
    initialData: {
      summary: {
        totalRevenue: 0,
        totalSalaries: 0,
        totalCommissions: 0,
        totalExpenses: 0,
        totalCosts: 0,
        netProfit: 0,
        breakEvenDay: null,
        daysInMonth: 30,
        currentDay: 0,
        projectedMonthRevenue: 0,
        profitMargin: 0,
        dailySalaryCost: 0,
      },
      dailyData: [],
      employeeCosts: [],
    },
  });

  const { summary, dailyData, employeeCosts } = data;
  const isInProfit = summary.netProfit >= 0;

  // ── Breakeven chart datasets ──────────────────────────────────────────────
  const dayLabels = dailyData.map((d: any) => String(d.day));

  const actualRevenueLine = dailyData.map((d: any) =>
    d.isProjected ? null : d.cumulativeRevenue
  );
  // Projected line starts at the last actual point so the lines connect
  const projectedRevenueLine = dailyData.map((d: any, i: number) => {
    if (!d.isProjected && i < dailyData.length - 1 && dailyData[i + 1]?.isProjected)
      return d.cumulativeRevenue;
    return d.isProjected ? d.cumulativeRevenue : null;
  });
  const costsLine = dailyData.map((d: any) => d.cumulativeCost);

  const breakEvenChartData = {
    labels: dayLabels,
    datasets: [
      {
        label: t.financial.cumulativeRevenue,
        data: actualRevenueLine,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f610",
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
        spanGaps: false,
      },
      {
        label: t.financial.projectedRevenue,
        data: projectedRevenueLine,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f608",
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        tension: 0.3,
        fill: false,
        spanGaps: false,
      },
      {
        label: t.financial.cumulativeCosts,
        data: costsLine,
        borderColor: "#ef4444",
        backgroundColor: "#ef444410",
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const breakEvenChartOptions: any = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            `${ctx.dataset.label}: ${ctx.parsed.y?.toLocaleString("ar-EG")} ج.م`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (v: any) => `${Number(v).toLocaleString()} ج.م`,
        },
      },
      x: { title: { display: true, text: t.financial.dayUnit } },
    },
  };

  // ── Daily bar chart ────────────────────────────────────────────────────────
  const actualDays = dailyData.filter((d: any) => !d.isProjected);
  const barData = {
    labels: actualDays.map((d: any) => String(d.day)),
    datasets: [
      {
        label: t.financial.totalRevenue,
        data: actualDays.map((d: any) => d.revenue),
        backgroundColor: "#3b82f680",
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
      {
        label: t.financial.totalCosts,
        data: actualDays.map((d: any) => d.totalCost),
        backgroundColor: "#ef444480",
        borderColor: "#ef4444",
        borderWidth: 1,
      },
    ],
  };

  const barOptions: any = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { position: "top" } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v: any) => `${Number(v).toLocaleString()} ج.م` },
      },
    },
  };

  // ── Cost breakdown donut ──────────────────────────────────────────────────
  const donutData = {
    labels: [
      t.financial.salaries,
      t.financial.commissions,
      t.financial.expenses,
    ],
    datasets: [
      {
        data: [
          summary.totalSalaries,
          summary.totalCommissions,
          summary.totalExpenses,
        ],
        backgroundColor: ["#8b5cf680", "#f9731680", "#ef444480"],
        borderColor: ["#8b5cf6", "#f97316", "#ef4444"],
        borderWidth: 2,
      },
    ],
  };

  const donutOptions: any = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            ` ${ctx.label}: ${ctx.parsed.toLocaleString()} ج.م`,
        },
      },
    },
  };

  // ── Employee table columns ────────────────────────────────────────────────
  const jobLabelMap: Record<string, string> = {
    delivery: t.employees.jobDelivery,
    manger: t.employees.jobManager,
    "call center": t.employees.jobCallCenter,
  };

  const empColumns = [
    { title: t.common.name, dataIndex: "name", key: "name" },
    {
      title: t.employees.job,
      dataIndex: "job",
      key: "job",
      render: (j: string) => jobLabelMap[j] ?? j,
    },
    {
      title: t.employees.salary,
      dataIndex: "salary",
      key: "salary",
      render: (v: number) => `${v.toLocaleString()} ج.م`,
    },
    {
      title: t.financial.earnedCommission,
      dataIndex: "earnedCommission",
      key: "earnedCommission",
      render: (v: number) => `${v.toLocaleString()} ج.م`,
    },
    {
      title: t.financial.totalCosts,
      dataIndex: "totalCost",
      key: "totalCost",
      render: (v: number) => (
        <span className="font-bold">{v.toLocaleString()} ج.م</span>
      ),
    },
  ];

  // ── Profitability progress (how close revenue is to covering costs) ────────
  const coveragePercent =
    summary.totalCosts > 0
      ? Math.min(Math.round((summary.totalRevenue / summary.totalCosts) * 100), 200)
      : 0;

  return (
    <div className="flex flex-col w-full gap-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-tittle dark:text-on-surface">
            {t.financial.pageTitle}
          </h1>
          <div
            className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full w-fit ${
              isInProfit
                ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                : "text-red-500 bg-red-50 dark:bg-red-900/20"
            }`}
          >
            <FontAwesomeIcon
              icon={isInProfit ? faCircleCheck : faTriangleExclamation}
            />
            {isInProfit ? t.financial.profitZone : t.financial.lossZone}
          </div>
        </div>
        <MonthPicker
          value={dayjs(
            `${selectedMonth.year}-${String(selectedMonth.month).padStart(2, "0")}`,
            "YYYY-MM"
          )}
          onChange={(date) => {
            if (date) {
              setSelectedMonth({ month: date.month() + 1, year: date.year() });
            }
          }}
          className="min-w-[160px]"
        />
      </div>

      {/* KPI Cards */}
      <div className="flex flex-wrap gap-4">
        <KpiCard
          title={t.financial.totalRevenue}
          value={summary.totalRevenue}
          icon={faArrowTrendUp}
          iconColor="text-[#3b82f6]"
          iconBgColor="bg-[#3b82f620]"
          isCurrency
          decimals={2}
        />
        <KpiCard
          title={t.financial.totalCosts}
          value={summary.totalCosts}
          icon={faMoneyBillWave}
          iconColor="text-[#ef4444]"
          iconBgColor="bg-[#ef444420]"
          isCurrency
          decimals={2}
          subtitle={`${t.financial.salaries}: ${summary.totalSalaries.toLocaleString()} | ${t.financial.commissions}: ${summary.totalCommissions.toLocaleString()} | ${t.financial.expenses}: ${summary.totalExpenses.toLocaleString()}`}
        />
        <KpiCard
          title={t.financial.netProfit}
          value={summary.netProfit}
          icon={faScaleBalanced}
          iconColor={summary.netProfit >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}
          iconBgColor={summary.netProfit >= 0 ? "bg-[#22c55e20]" : "bg-[#ef444420]"}
          isCurrency
          decimals={2}
          isProfit
        />
        <KpiCard
          title={t.financial.breakEvenDay}
          value={summary.breakEvenDay ?? 0}
          icon={faCalendarCheck}
          iconColor={summary.breakEvenDay ? "text-[#22c55e]" : "text-[#f59e0b]"}
          iconBgColor={summary.breakEvenDay ? "bg-[#22c55e20]" : "bg-[#f59e0b20]"}
          suffix={summary.breakEvenDay ? ` ${t.financial.dayUnit}` : ""}
          subtitle={!summary.breakEvenDay ? t.financial.notReached : undefined}
        />
        <KpiCard
          title={t.financial.profitMargin}
          value={summary.profitMargin}
          icon={faPercent}
          iconColor="text-[#8b5cf6]"
          iconBgColor="bg-[#8b5cf620]"
          suffix="%"
          decimals={1}
          isProfit
        />
        <KpiCard
          title={t.financial.projectedMonthRevenue}
          value={summary.projectedMonthRevenue}
          icon={faArrowTrendUp}
          iconColor="text-[#06b6d4]"
          iconBgColor="bg-[#06b6d420]"
          isCurrency
          decimals={2}
          subtitle={t.financial.basedOnAvg}
        />
      </div>

      {/* Cost coverage progress bar */}
      <div className="bg-white dark:bg-surface-mid rounded-xl px-6 py-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-gray-600 dark:text-on-surface-variant">
            {t.financial.totalRevenue} / {t.financial.totalCosts} — {coveragePercent}%
          </span>
          <Tag color={coveragePercent >= 100 ? "green" : "red"}>
            {coveragePercent >= 100 ? t.financial.profitZone : t.financial.lossZone}
          </Tag>
        </div>
        <div className="w-full h-5 bg-gray-100 dark:bg-surface-high rounded-full overflow-hidden">
          {/* Cost bar (full width = 100% of costs) */}
          <div className="relative h-full">
            <div
              className="absolute inset-0 bg-red-200 dark:bg-red-900/30 rounded-full"
            />
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                coveragePercent >= 100 ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(coveragePercent, 100)}%` }}
            />
            {/* Breakeven marker */}
            <div
              className="absolute inset-y-0 w-0.5 bg-orange-500"
              style={{ left: "100%" }}
              title={t.financial.breakEvenDay}
            />
          </div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>0</span>
          <span className="text-orange-500 font-semibold">
            {summary.totalCosts.toLocaleString()} ج.م ({t.financial.breakEvenDay})
          </span>
        </div>
      </div>

      {/* Breakeven line chart */}
      <div className="bg-white dark:bg-surface-mid rounded-xl px-6 py-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center bg-[#3b82f620] rounded-full w-9 h-9 shrink-0">
            <FontAwesomeIcon icon={faArrowTrendUp} className="text-[#3b82f6]" />
          </div>
          <span className="font-bold text-lg text-gray-600 dark:text-on-surface-variant">
            {t.financial.breakEvenChart}
          </span>
          {summary.breakEvenDay && (
            <span className="ms-auto text-sm font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
              ✓ {t.financial.breakEvenDay} {summary.breakEvenDay}
            </span>
          )}
        </div>
        {dailyData.length > 0 ? (
          <Line data={breakEvenChartData} options={breakEvenChartOptions} />
        ) : (
          <div className="h-40 flex items-center justify-center text-gray-400">
            —
          </div>
        )}
      </div>

      {/* Daily bar + Cost donut */}
      <div className="flex flex-wrap gap-5">
        {/* Daily revenue vs cost bar */}
        <div className="flex-1 min-w-[300px] bg-white dark:bg-surface-mid rounded-xl px-6 py-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center bg-[#f9731620] rounded-full w-9 h-9 shrink-0">
              <FontAwesomeIcon
                icon={faMoneyBillWave}
                className="text-[#f97316]"
              />
            </div>
            <span className="font-bold text-lg text-gray-600 dark:text-on-surface-variant">
              {t.financial.dailyBreakdown}
            </span>
          </div>
          {actualDays.length > 0 ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400">
              —
            </div>
          )}
        </div>

        {/* Cost breakdown donut */}
        <div className="min-w-[260px] max-w-[340px] bg-white dark:bg-surface-mid rounded-xl px-6 py-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center bg-[#8b5cf620] rounded-full w-9 h-9 shrink-0">
              <FontAwesomeIcon icon={faPercent} className="text-[#8b5cf6]" />
            </div>
            <span className="font-bold text-lg text-gray-600 dark:text-on-surface-variant">
              {t.financial.costBreakdown}
            </span>
          </div>
          {summary.totalCosts > 0 ? (
            <>
              <Doughnut data={donutData} options={donutOptions} />
              <div className="mt-4 flex flex-col gap-2 text-sm">
                {[
                  {
                    label: t.financial.salaries,
                    value: summary.totalSalaries,
                    color: "#8b5cf6",
                  },
                  {
                    label: t.financial.commissions,
                    value: summary.totalCommissions,
                    color: "#f97316",
                  },
                  {
                    label: t.financial.expenses,
                    value: summary.totalExpenses,
                    color: "#ef4444",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-500 dark:text-on-surface-variant">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ background: color }}
                      />
                      {label}
                    </span>
                    <span className="font-semibold text-tittle dark:text-on-surface">
                      {value.toLocaleString()} ج.م
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400">
              —
            </div>
          )}
        </div>
      </div>

      {/* Employee cost table */}
      <div className="bg-white dark:bg-surface-mid rounded-xl px-6 py-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center bg-[#0f62fe20] rounded-full w-9 h-9 shrink-0">
            <FontAwesomeIcon icon={faBriefcase} className="text-[#0f62fe]" />
          </div>
          <span className="font-bold text-lg text-gray-600 dark:text-on-surface-variant">
            {t.financial.employeeCosts}
          </span>
          <span className="ms-auto text-sm text-gray-400">
            {t.financial.totalSalaries}: {summary.totalSalaries.toLocaleString()} ج.م
          </span>
        </div>
        <Table
          columns={empColumns}
          dataSource={employeeCosts}
          rowKey="id"
          pagination={false}
          scroll={{ x: true }}
          summary={(rows) => {
            const totSalary = rows.reduce((s: number, r: any) => s + r.salary, 0);
            const totComm = rows.reduce((s: number, r: any) => s + r.earnedCommission, 0);
            const totCost = rows.reduce((s: number, r: any) => s + r.totalCost, 0);
            return (
              <Table.Summary.Row className="font-bold bg-gray-50 dark:bg-surface-high">
                <Table.Summary.Cell index={0} colSpan={2}>
                  Total
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  {totSalary.toLocaleString()} ج.م
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  {totComm.toLocaleString()} ج.م
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <span className="font-bold text-red-500">
                    {totCost.toLocaleString()} ج.م
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </div>
    </div>
  );
};

export default Page;
