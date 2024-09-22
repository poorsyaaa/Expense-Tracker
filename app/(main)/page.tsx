"use client";

import { useState, useMemo } from "react";
import { Battery, Calendar, DollarSign, Loader2, PieChart } from "lucide-react";
import DashboardCard from "./_components/dashboard/card/dashboard-card";
import RecentExpensesTable from "./_components/dashboard/recent-expenses-table";
import UpcomingExpenses from "./_components/dashboard/upcoming-expenses";
import SavingsOverviewCard from "./_components/dashboard/card/savings-overview-card";
import ExpenseTrends from "./_components/dashboard/chart/expense-trend";
import BudgetUtilization from "./_components/dashboard/chart/budget-utilization";
import IncomeVsExpenses from "./_components/dashboard/chart/income-vs-expense";
import SpendingByCategory from "./_components/dashboard/chart/spending-by-category";
import {
  useGetDashboardData,
  useGetMonthlyDashboardData,
} from "@/api/queries/dashboard-hook";
import {
  calculatePercentage,
  calculatePercentageChange,
  formatDate,
  formatPreset,
} from "@/lib/utils";
import { DatePickerWithPresets } from "./_components/date-picker";
import { DashboardParamsSchema } from "@/lib/schema/dashboard";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const [dashboardParams, setDashboardParams] = useState<DashboardParamsSchema>(
    { dateRange: "this_month" },
  );

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    error: dashboardError,
  } = useGetDashboardData(dashboardParams);
  const {
    data: monthlyData,
    isLoading: isMonthlyLoading,
    isError: isMonthlyError,
    error: monthlyError,
  } = useGetMonthlyDashboardData();

  const handleDateChange = (selectedParams: DashboardParamsSchema) => {
    setDashboardParams(selectedParams);
  };

  const loadingIndicator = (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="mx-auto my-3 animate-spin" />
        <span className="text-center text-sm font-light">
          Loading your dashboard...
        </span>
      </div>
    </div>
  );

  const formattedMonthlyData = useMemo(() => {
    if (!monthlyData) return null;
    return {
      totalExpensesAllTime: monthlyData.card.totalExpensesAllTime,
      currentMonthlyBudget: monthlyData.card.currentMonthlyBudget,
      remainingBudget: monthlyData.card.remainingBudget,
      expensesThisMonth: monthlyData.card.expensesThisMonth,
      previousMonthExpenses: monthlyData.card.previousMonthExpenses,
      recentExpenses: monthlyData.table.recentExpenses,
      upcomingExpenses: monthlyData.table.upcomingExpenses,
    };
  }, [monthlyData]);

  const getErrorMessage = (error: {
    response?: { statusText?: string };
    message?: string;
  }): string => {
    return error?.response?.statusText ?? error?.message ?? "Unknown error";
  };

  const renderMonthlyData = () => {
    if (isMonthlyError) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-sm font-light text-red-500">
            Failed to load monthly data: {getErrorMessage(monthlyError)}
          </span>
        </div>
      );
    }

    if (isMonthlyLoading || !formattedMonthlyData) {
      return loadingIndicator;
    }

    return (
      <>
        {/* Dashboard Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Expenses (All-Time)"
            amount={formattedMonthlyData.totalExpensesAllTime}
            currency="PHP"
            subtitle={`Updated on ${formatDate(new Date())}`}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <DashboardCard
            title="Monthly Budget"
            amount={formattedMonthlyData.currentMonthlyBudget}
            currency="PHP"
            subtitle="Set for this month"
            icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
          />
          <DashboardCard
            title="Remaining Budget"
            amount={formattedMonthlyData.remainingBudget}
            currency="PHP"
            subtitle={`${calculatePercentage(
              formattedMonthlyData.remainingBudget,
              formattedMonthlyData.currentMonthlyBudget,
            )}% of budget remaining`}
            icon={<Battery className="h-4 w-4 text-muted-foreground" />}
          />
          <DashboardCard
            title="Expenses This Month"
            amount={formattedMonthlyData.expensesThisMonth}
            currency="PHP"
            subtitle={`${calculatePercentageChange(
              formattedMonthlyData.expensesThisMonth,
              formattedMonthlyData.previousMonthExpenses,
            )}% from last month`}
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
        {/* Tables Section */}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <RecentExpensesTable
            expenses={formattedMonthlyData.recentExpenses}
            currency="PHP"
          />
          <UpcomingExpenses
            expenses={formattedMonthlyData.upcomingExpenses}
            currency="PHP"
          />
        </div>
      </>
    );
  };

  const renderDashboardData = () => {
    if (isDashboardError) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-sm font-light text-red-500">
            Failed to load dashboard data: {getErrorMessage(dashboardError)}
          </span>
        </div>
      );
    }

    if (isDashboardLoading || !dashboardData) {
      return loadingIndicator;
    }

    return (
      <>
        {/* Overview Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <SavingsOverviewCard
            data={{
              income: dashboardData.overview.savingsOverview.totalIncome,
              expenses: dashboardData.overview.savingsOverview.totalExpenses,
              savings: dashboardData.overview.savingsOverview.totalSavings,
            }}
            currency="PHP"
          />
        </div>
        {/* Charts Section */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          <SpendingByCategory
            data={dashboardData.chart.spendingByCategory.map((category) => ({
              category: category.categoryName,
              amount: category.amount,
              fill: category.fill,
              icon: category.icon,
            }))}
          />
          <IncomeVsExpenses data={dashboardData.chart.incomeVsExpenses} />
          <BudgetUtilization
            budget={5000}
            utilized={3245.67}
            percentage={dashboardData.chart.budgetUtilized.selected.percentage}
          />
          <ExpenseTrends data={dashboardData.chart.expenseTrends} />
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Monthly Data Section */}
      {renderMonthlyData()}
      <Separator className="my-4" />
      {/* Date Range Picker */}
      <DatePickerWithPresets
        onDateChange={handleDateChange}
        initialPreset={dashboardParams.dateRange}
        initialDate={
          dashboardParams.startDate && dashboardParams.endDate
            ? {
                from: new Date(dashboardParams.startDate),
                to: new Date(dashboardParams.endDate),
              }
            : undefined
        }
        className="flex flex-1 items-end justify-end"
      />
      {/* Display Selected Date Range */}
      <div className="mb-4 text-right text-sm text-muted-foreground">
        {(() => {
          if (dashboardParams.dateRange) {
            return `Showing data for: ${formatPreset(dashboardParams.dateRange)}`;
          } else if (dashboardParams.startDate && dashboardParams.endDate) {
            return `Showing data from ${formatDate(new Date(dashboardParams.startDate))} to ${formatDate(new Date(dashboardParams.endDate))}`;
          } else {
            return "Select a date range to view data.";
          }
        })()}
      </div>
      {/* Dashboard Data Section */}
      {renderDashboardData()}
    </div>
  );
}
