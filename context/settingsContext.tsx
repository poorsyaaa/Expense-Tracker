"use client";

import { useGetDefaultSettings } from "@/api/queries/settings/default-hook";
import {
  DefaultSettings,
  DefaultSettingsResponse,
  PaymentMethod,
} from "@/api/types/settings";
import { createContext, useContext, ReactNode, useMemo } from "react";

interface SettingsContextType {
  data?: DefaultSettingsResponse;
  default_settings?:
    | DefaultSettings
    | {
        defaultBudget: number;
        defaultIncome: number;
        currency: string;
        locale: string;
        timeZone: string;
        dateFormat: string;
        defaultPaymentMethod: PaymentMethod;
      };
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
  const { data, isLoading, error } = useGetDefaultSettings();

  const contextValue = useMemo(
    () => ({
      data,
      default_settings: data?.settings ?? {
        defaultBudget: 0,
        defaultIncome: 0,
        currency: "PHP",
        locale: "en-US",
        timeZone: "UTC",
        dateFormat: "MM/dd/yyyy",
        defaultPaymentMethod: "CASH",
      },
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
