"use client";

import { Pie, PieChart } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { generateChartConfig } from "@/lib/utils";
import { ICONS_MAP } from "@/components/ui/icon-picker";
import { Notebook } from "lucide-react";

interface SpendingByCategory {
  category: string;
  amount: number;
  fill?: string;
  icon?: string;
}

interface SpendingByCategoryProps {
  data: SpendingByCategory[];
  currency?: string;
}

const SpendingByCategoryComponent: React.FC<SpendingByCategoryProps> = ({
  data,
}) => {
  const chartConfig = generateChartConfig(
    data.map((item) => ({
      property: item.category,
      label: item.category,
      fill: item.fill,
      icon: item.icon ? ICONS_MAP[item.icon] : undefined,
    })),
    {
      category: {
        label: "Category",
      },
      amount: {
        label: "Amount",
        color: "hsl(var(--chart-1))",
      },
    },
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart width={300} height={300}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel indicator="line" />}
            />
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="var(--color-category)"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/6 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <p className="flex items-center gap-1 font-medium leading-none">
          Category Breakdown and Spending
          <Notebook className="h-4 w-4" />
        </p>
        <p className="leading-none text-muted-foreground">
          Showing how much you&apos;ve spent in each category
        </p>
      </CardFooter>
    </Card>
  );
};

export default SpendingByCategoryComponent;
