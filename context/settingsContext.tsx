"use client";

import { useGetAllSettings } from "@/api/queries/settings-hook";
import {
  Category,
  DefaultSettings,
  MonthlyBudget,
  MonthlyIncome,
  SettingsResponse,
} from "@/api/types/settings";
import { createContext, useContext, ReactNode, useMemo } from "react";

interface SettingsContextType {
  data?: SettingsResponse;
  default_settings?:
    | DefaultSettings
    | {
        defaultBudget: number;
        defaultIncome: number;
      };
  categories?: Category[] | [];
  monthly_budgets?: MonthlyBudget[] | [];
  monthly_incomes?: MonthlyIncome[] | [];
  isLoading: boolean;
  error: Error | null;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

// The provider component
export default function SettingsProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { data, isLoading, error } = useGetAllSettings();

  const contextValue = useMemo(
    () => ({
      data,
      default_settings: data?.default_settings ?? {
        defaultBudget: 0,
        defaultIncome: 0,
      },
      categories: data?.categories ?? [],
      monthly_budgets: data?.monthly_budgets ?? [],
      monthly_incomes: data?.monthly_incomes ?? [],
      isLoading,
      error,
    }),
    [data, isLoading, error],
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

// The custom hook to access context data
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSession must be used within a SettingsProvider");
  }
  return context;
}
