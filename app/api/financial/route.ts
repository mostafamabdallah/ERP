import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import moment from "moment";

const prisma = new PrismaClient();

const DELIVERED_STATUSES = ["success", "money_collected", "collected", "delivered"];
const STATUS_LIST = DELIVERED_STATUSES.map((s) => `'${s}'`).join(",");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");

  const now = moment();
  const year = yearParam ? Number(yearParam) : now.year();
  const month = monthParam ? Number(monthParam) : now.month() + 1;

  const startDate = moment(`${year}-${month}`, "YYYY-MM").startOf("month").toDate();
  const endDate = moment(`${year}-${month}`, "YYYY-MM").endOf("month").toDate();
  const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();

  const isCurrentMonth = now.year() === year && now.month() + 1 === month;
  const currentDay = isCurrentMonth ? now.date() : daysInMonth;

  try {
    // 1. Total active employee salaries (raw SQL — isActive field)
    const salaryRows: any[] = await prisma.$queryRawUnsafe(
      `SELECT COALESCE(SUM(salary), 0) AS total FROM "Employees" WHERE "isActive" = true`
    );
    const totalSalaries = Number(salaryRows[0]?.total ?? 0);

    // 2. Daily revenue — all orders, grouped by day
    const revenueRows: any[] = await prisma.$queryRawUnsafe(
      `SELECT DATE(create_at) AS day, COALESCE(SUM("deliveryCost"), 0) AS revenue
       FROM "Order"
       WHERE create_at >= $1 AND create_at <= $2
       GROUP BY DATE(create_at)
       ORDER BY day`,
      startDate,
      endDate
    );

    // 3. Daily commissions — delivered orders joined with employee commission rate
    const commissionRows: any[] = await prisma.$queryRawUnsafe(
      `SELECT DATE(o.create_at) AS day,
              COALESCE(SUM(o."deliveryCost" * e.commission / 100), 0) AS commission
       FROM "Order" o
       JOIN "Employees" e ON o."employeeId" = e.id
       WHERE o.create_at >= $1 AND o.create_at <= $2
         AND o.status IN (${STATUS_LIST})
       GROUP BY DATE(o.create_at)
       ORDER BY day`,
      startDate,
      endDate
    );

    // 4. Daily expenses from Expense table
    const expenseRows: any[] = await prisma.$queryRawUnsafe(
      `SELECT DATE(date) AS day, COALESCE(SUM(amount), 0) AS expenses
       FROM "Expense"
       WHERE date >= $1 AND date <= $2
       GROUP BY DATE(date)
       ORDER BY day`,
      startDate,
      endDate
    );

    // 5. Per-employee cost breakdown
    const employeeRows: any[] = await prisma.$queryRawUnsafe(
      `SELECT e.id, e.name, e.job, e.salary, e.commission,
              COALESCE(SUM(o."deliveryCost" * e.commission / 100), 0) AS earned_commission
       FROM "Employees" e
       LEFT JOIN "Order" o ON o."employeeId" = e.id
         AND o.create_at >= $1 AND o.create_at <= $2
         AND o.status IN (${STATUS_LIST})
       WHERE e."isActive" = true
       GROUP BY e.id, e.name, e.job, e.salary, e.commission
       ORDER BY e.name`,
      startDate,
      endDate
    );

    // Build day-keyed lookup maps
    const fmt = (d: any) => moment(d).format("YYYY-MM-DD");
    const revenueByDay: Record<string, number> = {};
    revenueRows.forEach((r) => { revenueByDay[fmt(r.day)] = Number(r.revenue); });

    const commissionByDay: Record<string, number> = {};
    commissionRows.forEach((r) => { commissionByDay[fmt(r.day)] = Number(r.commission); });

    const expenseByDay: Record<string, number> = {};
    expenseRows.forEach((r) => { expenseByDay[fmt(r.day)] = Number(r.expenses); });

    // Compute actuals for projection
    const actualRevenue = Object.values(revenueByDay).reduce((a, b) => a + b, 0);
    const actualCommissions = Object.values(commissionByDay).reduce((a, b) => a + b, 0);
    const actualExpenses = Object.values(expenseByDay).reduce((a, b) => a + b, 0);

    const avgDailyRevenue = currentDay > 0 ? actualRevenue / currentDay : 0;
    const avgDailyCommissions = currentDay > 0 ? actualCommissions / currentDay : 0;
    const avgDailyExpenses = currentDay > 0 ? actualExpenses / currentDay : 0;
    const dailySalaryCost = daysInMonth > 0 ? totalSalaries / daysInMonth : 0;

    // Build day-by-day array
    let cumulativeRevenue = 0;
    let cumulativeCost = 0;
    let breakEvenDay: number | null = null;
    const dailyData: any[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = moment({ year, month: month - 1, day }).format("YYYY-MM-DD");
      const isProjected = day > currentDay;

      const revenue = isProjected ? avgDailyRevenue : (revenueByDay[dateStr] ?? 0);
      const commissions = isProjected ? avgDailyCommissions : (commissionByDay[dateStr] ?? 0);
      const expenses = isProjected ? avgDailyExpenses : (expenseByDay[dateStr] ?? 0);
      const salaryCost = dailySalaryCost;
      const totalCost = salaryCost + commissions + expenses;

      cumulativeRevenue += revenue;
      cumulativeCost += totalCost;

      if (breakEvenDay === null && cumulativeRevenue >= cumulativeCost && cumulativeRevenue > 0) {
        breakEvenDay = day;
      }

      dailyData.push({
        day,
        date: dateStr,
        revenue: round2(revenue),
        commissions: round2(commissions),
        expenses: round2(expenses),
        salaryCost: round2(salaryCost),
        totalCost: round2(totalCost),
        cumulativeRevenue: round2(cumulativeRevenue),
        cumulativeCost: round2(cumulativeCost),
        cumulativeProfit: round2(cumulativeRevenue - cumulativeCost),
        isProjected,
      });
    }

    const totalCosts = totalSalaries + actualCommissions + actualExpenses;
    const netProfit = actualRevenue - totalCosts;
    const profitMargin = actualRevenue > 0 ? (netProfit / actualRevenue) * 100 : 0;
    const projectedMonthRevenue = avgDailyRevenue * daysInMonth;

    return NextResponse.json({
      summary: {
        totalRevenue: round2(actualRevenue),
        totalSalaries: round2(totalSalaries),
        totalCommissions: round2(actualCommissions),
        totalExpenses: round2(actualExpenses),
        totalCosts: round2(totalCosts),
        netProfit: round2(netProfit),
        breakEvenDay,
        daysInMonth,
        currentDay,
        projectedMonthRevenue: round2(projectedMonthRevenue),
        profitMargin: Math.round(profitMargin * 10) / 10,
        dailySalaryCost: round2(dailySalaryCost),
      },
      dailyData,
      employeeCosts: employeeRows.map((e) => ({
        id: Number(e.id),
        name: e.name,
        job: e.job,
        salary: Number(e.salary),
        commissionRate: Number(e.commission),
        earnedCommission: round2(Number(e.earned_commission)),
        totalCost: round2(Number(e.salary) + Number(e.earned_commission)),
      })),
    });
  } catch (err) {
    console.error("Financial API error:", err);
    return NextResponse.json({ error: "Failed to load financial data" }, { status: 500 });
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
