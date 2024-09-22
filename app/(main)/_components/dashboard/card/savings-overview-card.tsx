"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { calculatePercentage, cn } from "@/lib/utils";

interface SavingsOverview {
  income: number;
  expenses: number;
  savings: number;
}

interface SavingsOverviewProps {
  data: SavingsOverview;
  currency?: string;
}

const SavingsOverviewCard: React.FC<SavingsOverviewProps> = ({
  data,
  currency,
}) => {
  const savingsPercentage = calculatePercentage(data.savings, data.income);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Income:</span>
            <span className="font-semibold">
              {data.income.toLocaleString()} {currency}
            </span>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Expenses:</span>
            <span className="font-semibold">
              {data.expenses.toLocaleString()} {currency}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Savings:</span>
            <span
              className={cn(
                "font-semibold",
                data.savings < 0 ? "text-red-500" : "text-green-500",
              )}
            >
              {data.savings.toLocaleString()} {currency} ({savingsPercentage}%)
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Showing income, expenses, and savings for the selected date range.
      </CardFooter>
    </Card>
  );
};

export default SavingsOverviewCard;
