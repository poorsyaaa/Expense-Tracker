"use client";

import { useSettings } from "@/context/settingsContext";
import BudgetSettingsForm from "../../_components/budget-settings-form";

export default function Page() {
  const { default_settings, monthly_budgets, monthly_incomes } = useSettings();

  return <BudgetSettingsForm {...default_settings} />;
}
