"use client";

import { Pie, PieChart } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { generateChartConfig } from "@/lib/utils";
import { ICONS_MAP } from "@/components/ui/icon-picker";

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
              content={<ChartTooltipContent hideLabel indicator="line" />}
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
