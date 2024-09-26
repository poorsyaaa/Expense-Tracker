export interface DefaultSettingsResponse {
  settings: DefaultSettings;
}

export type PaymentMethod =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "CASH"
  | "BANK_TRANSFER"
  | "DIGITAL_BANK"
  | "SAVINGS"
  | "OTHER";

export interface DefaultSettings {
  id: string;
  defaultBudget: number;
  defaultIncome: number;
  currency: string;
  locale: string;
  timeZone: string;
  dateFormat: string;
  defaultPaymentMethod: PaymentMethod;
  userId: string;
  createdAt: string;
}

export interface CategoriesResponse {
  categories: Category[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  userId: string;
  createdAt: string;
}

export interface MonthlyBudgetsResponse {
  budgets: MonthlyBudget[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface MonthlyBudget {
  id: string;
  amount: number;
  month: number;
  year: number;
  userId: string;
  createdAt: string;
}

export interface MonthlyIncomesResponse {
  incomes: MonthlyIncome[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface MonthlyIncome {
  id: string;
  amount: number;
  month: number;
  year: number;
  userId: string;
  createdAt: string;
}
