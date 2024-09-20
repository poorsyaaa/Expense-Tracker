"use client";

import { LineChart, Line, XAxis, CartesianGrid } from "recharts";
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

interface ExpenseTrend {
  month: string;
  amount: number;
}

interface Trend {
  type: "up" | "down";
  value: number;
}

interface ExpenseTrendsProps {
  data: ExpenseTrend[];
  trend?: Trend;
}

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const ExpenseTrends: React.FC<ExpenseTrendsProps> = ({ data, trend }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Trends Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="amount"
              type="natural"
              stroke="var(--color-amount)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {(() => {
            if (trend?.type === "up") {
              return (
                <>
                  Expenses Increased by {trend.value}% this year
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </>
              );
            } else if (trend?.type === "down") {
              return (
                <>
                  Expenses Decreased by {trend.value}% this year
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </>
              );
            } else {
              return <span>Expenses Unchanged this year</span>;
            }
          })()}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total expenses for the last 12 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExpenseTrends;
