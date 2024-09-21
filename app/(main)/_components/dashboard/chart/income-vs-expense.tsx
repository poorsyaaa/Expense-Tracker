"use client";

import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Label,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingDown, TrendingUp } from "lucide-react";
import { calculateAverages } from "@/lib/utils";

interface IncomeExpenses {
  month: string; // e.g., "January"
  income: number;
  expenses: number;
}

interface Trend {
  type: "up" | "down";
  value: number;
}

interface IncomeVsExpensesProps {
  data: IncomeExpenses[];
  trend?: Trend;
}

const chartConfig = {
  month: {
    label: "Month",
  },
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const IncomeVsExpenses: React.FC<IncomeVsExpensesProps> = ({ data, trend }) => {
  const average = calculateAverages(data);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Monthly Income vs. Expenses</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            width={300}
            height={300}
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} />
            <Bar dataKey="income" fill="var(--color-income)" radius={8} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={8} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel indicator="dashed" />}
            />
            <ReferenceLine
              y={average?.income ?? 0}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
            >
              <Label
                position="insideBottomLeft"
                value="Average Income"
                offset={10}
                fill="hsl(var(--foreground))"
              />
              <Label
                position="insideTopLeft"
                value={average?.income.toLocaleString() ?? 0}
                className="text-lg"
                fill="hsl(var(--foreground))"
                offset={10}
                startOffset={100}
              />
            </ReferenceLine>
            <ReferenceLine
              y={average?.expenses ?? 0}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
            >
              <Label
                position="insideBottomRight"
                value="Average Expenses"
                offset={10}
                fill="hsl(var(--foreground))"
              />
              <Label
                position="insideTopRight"
                value={average?.expenses.toLocaleString() ?? 0}
                className="text-lg"
                fill="hsl(var(--foreground))"
                offset={10}
                startOffset={100}
              />
            </ReferenceLine>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {(() => {
            if (trend) {
              if (trend.type === "up") {
                return (
                  <>
                    Income Increased by {trend.value}% this year
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </>
                );
              } else if (trend.type === "down") {
                return (
                  <>
                    Income Decreased by {trend.value}% this year
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </>
                );
              }
            }
            return <span>Income Unchanged this year</span>;
          })()}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total income and expenses for the last 12 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default IncomeVsExpenses;
