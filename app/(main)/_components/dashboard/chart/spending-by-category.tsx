"use client";

import { Pie, PieChart } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SpendingByCategory {
  category: string;
  amount: number;
  fill?: string;
}

interface SpendingByCategoryProps {
  data: SpendingByCategory[];
}

const chartConfig = {
  category: {
    label: "Category",
  },
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const SpendingByCategoryComponent: React.FC<SpendingByCategoryProps> = ({
  data,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={data} dataKey="amount" nameKey="category" />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="translate-y-2 flex-wrap gap-2 md:translate-y-5 [&>*]:basis-1/6 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SpendingByCategoryComponent;
