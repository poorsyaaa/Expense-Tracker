export interface DashboardMonthResponse {
  card: DashboardCards;
  table: DashboardTables;
  updatedAt: string;
}

export interface DashboardCards {
  totalExpensesAllTime: number;
  currentMonthlyBudget: number;
  expensesThisMonth: number;
  remainingBudget: number;
  previousMonthExpenses: number;
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

export interface DashboardResponse {
  overview: SavingsOverview;
  chart: DashboardCharts;
  updatedAt: string;
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
  selected: BudgetUtilized;
  previous: BudgetUtilized;
}

export interface BudgetUtilized {
  totalBudget: number;
  totalExpenses: number;
  percentage: string;
}

export interface ExpenseTrendData {
  month: string;
  amount: number;
}

export type Currency = "PHP" | "USD" | "EUR";
