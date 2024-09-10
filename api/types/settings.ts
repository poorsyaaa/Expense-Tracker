import { SettingsSchema } from "@/lib/schema/settings";

export interface SettingsResponse {
  default_settings: DefaultSettings;
  categories: Category[];
  monthly_budgets: MonthlyBudget[];
  monthly_incomes: MonthlyIncome[];
}

export interface DefaultSettings {
  id: string;
  defaultBudget: number;
  defaultIncome: number;
  currency: string;
  locale: string;
  timeZone: string;
  dateFormat: string;
  defaultPaymentMethod: SettingsSchema["defaultPaymentMethod"];
  userId: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  userId: string;
  createdAt: string;
}

export interface MonthlyBudget {
  id: string;
  amount: number;
  month: number;
  year: number;
  userId: string;
  createdAt: string;
}

export interface MonthlyIncome {
  id: string;
  amount: number;
  month: number;
  year: number;
  userId: string;
  createdAt: string;
}
