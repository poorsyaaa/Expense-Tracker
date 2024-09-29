// Define the Tag interface
interface Tag {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

// Define the Category interface
interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  userId: string;
  categoryGroupId: string;
  createdAt: string;
}

// Define the Expense interface
interface Expense {
  id: string;
  description: string;
  amount: number;
  type: "RECURRING" | "TRANSFER" | "ONE_TIME"; // Limit to valid types
  paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER" | "OTHER"; // Limit to valid payment methods
  categoryId: string;
  userId: string;
  startDate: string;
  dueDate: string;
  isPaid: boolean;
  createdAt: string;
  tags: Tag[]; // Array of tags
  category: Category; // Embedded category information
}

// Define the MonthlyIncome interface
interface MonthlyIncome {
  amount: number;
}

// Define the main Budget interface
export interface ExpenseResponse {
  expenses: Expense[]; // Array of expenses
  remainingBudget: number;
  totalExpenses: number;
  monthlyIncome: MonthlyIncome;
}
