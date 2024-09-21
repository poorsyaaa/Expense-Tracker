"use client";

import { Battery, Calendar, DollarSign, Loader2, PieChart } from "lucide-react";
import DashboardCard from "./_components/dashboard/card/dashboard-card";
import RecentExpensesTable from "./_components/dashboard/recent-expenses-table";
import UpcomingExpenses from "./_components/dashboard/upcoming-expenses";
import SavingsOverviewCard from "./_components/dashboard/card/savings-overview-card";
import ExpenseTrends from "./_components/dashboard/chart/expense-trend";
import BudgetUtilization from "./_components/dashboard/chart/budget-utilization";
import IncomeVsExpenses from "./_components/dashboard/chart/income-vs-expense";
import SpendingByCategory from "./_components/dashboard/chart/spending-by-category";
import { useGetDashboardData } from "@/api/queries/dashboard-hook";
import {
  calculatePercentage,
  calculatePercentageChange,
  formatDate,
} from "@/lib/utils";
import { DatePickerWithPresets } from "./_components/date-picker";

export default function Dashboard() {
  const currentDate = new Date();
  const { data, isPending } = useGetDashboardData({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });

  if (isPending || !data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="mx-auto my-3 animate-spin" />
          <span className="text-center text-sm font-light">
            Loading your dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <DatePickerWithPresets className="flex flex-1 items-end justify-end" />
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <DashboardCard
          title="Total expenses"
          amount={data.card.totalExpenses}
          currency="PHP"
          subtitle={`${calculatePercentageChange(
            data.card.totalExpenses,
            data.card.previousMonthExpenses,
          )}% from last month`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Monthly Budget"
          amount={data.card.monthlyBudget}
          currency="PHP"
          subtitle="Set for this month"
          icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Remaining Budget"
          amount={data.card.remainingBudget}
          currency="PHP"
          subtitle={`${calculatePercentage(data.card.remainingBudget, data.card.monthlyBudget)}% of budget remaining`}
          icon={<Battery className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Expenses This Month"
          amount={data.card.totalExpensesThisMonth}
          currency="PHP"
          subtitle={`Updated on ${formatDate(currentDate)}`}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      {/* overview*/}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <SavingsOverviewCard
          data={{
            income: data.overview.savingsOverview.totalIncome,
            expenses: data.overview.savingsOverview.totalExpenses,
            savings: data.overview.savingsOverview.totalSavings,
          }}
          currency="PHP"
        />
      </div>
      {/* chart*/}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <SpendingByCategory
          data={data.chart.spendingByCategory.map((category) => ({
            category: category.categoryName,
            amount: category.amount,
            fill: category.fill,
            icon: category.icon,
          }))}
        />
        <IncomeVsExpenses
          data={data.chart.incomeVsExpenses}
          trend={{
            type: "down",
            value: 3.8,
          }}
        />
        <BudgetUtilization
          budget={5000}
          utilized={3245.67}
          percentage={data.chart.budgetUtilized.percentage}
          trend={{
            type: "down",
            value: 3.8,
          }}
        />
        <ExpenseTrends
          data={data.chart.expenseTrends}
          trend={{
            type: "down",
            value: 3.8,
          }}
        />
      </div>
      {/* table*/}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <RecentExpensesTable
          expenses={data.table.recentExpenses}
          currency="PHP"
        />
        <UpcomingExpenses
          expenses={data.table.upcomingExpenses}
          currency="PHP"
        />
      </div>
    </div>
  );
}
