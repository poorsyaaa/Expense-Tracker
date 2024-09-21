export interface DashboardResponse {
  card: DashboardCards;
  overview: SavingsOverview;
  chart: DashboardCharts;
  table: DashboardTables;
  updatedAt: string;
}

export interface DashboardCards {
  totalExpenses: number;
  monthlyBudget: number;
  totalExpensesThisMonth: number;
  remainingBudget: number;
  previousMonthExpenses: number;
}

export interface SavingsOverview {
  savingsOverview: {
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
  };
}

export interface DashboardCharts {
  spendingByCategory: SpendingByCategory[];
  incomeVsExpenses: IncomeVsExpenses[];
  budgetUtilized: BudgetUtilization;
  expenseTrends: ExpenseTrendData[];
}

export interface SpendingByCategory {
  categoryId: string;
  categoryName: string;
  amount: number;
  fill: string;
  icon: string;
}

export interface IncomeVsExpenses {
  month: string;
  income: number;
  expenses: number;
}

export interface BudgetUtilization {
  budget: number;
  utilized: number;
  percentage: string;
}

export interface ExpenseTrendData {
  month: string;
  amount: number;
}

export interface DashboardTables {
  recentExpenses: RecentExpense[];
  upcomingExpenses: UpcomingExpense[];
}

export interface RecentExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
  date: string;
}

export interface UpcomingExpense {
  id: string;
  name: string;
  dueDate: string;
  amount: number;
  icon: string;
}

export type Currency = "PHP" | "USD" | "EUR";
