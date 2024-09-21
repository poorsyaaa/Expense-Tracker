"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Trend {
  type: "up" | "down";
  value: number;
}

interface BudgetUtilizationProps {
  percentage: string;
  budget?: number;
  utilized?: number;
  trend?: Trend;
}

const chartConfig = {
  budget: {
    label: "Budget",
  },
  value: {
    label: "utilized",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const BudgetUtilization: React.FC<BudgetUtilizationProps> = ({
  percentage,
  // budget,
  // utilized,
  trend,
}) => {
  const angle = parseFloat(percentage ?? "0.00") * 3.6;

  const data = [
    {
      name: "Utilized",
      value: parseFloat(percentage),
      fill: "var(--color-value)",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Budget Utilization</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadialBarChart
            width={300}
            height={300}
            data={data}
            startAngle={0}
            endAngle={angle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[85, 75]}
            />
            <RadialBar cornerRadius={10} background dataKey="value" />
            <PolarRadiusAxis
              type="number"
              domain={[0, 100]}
              tick={false}
              tickLine={false}
              axisLine={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {`${percentage}%`}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Utilized
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {(() => {
            if (trend?.type === "up") {
              return (
                <>
                  Budget Utilized Increased by {trend.value}% this month
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </>
              );
            } else if (trend?.type === "down") {
              return (
                <>
                  <span>
                    Budget Utilized Decreased by {trend.value}% this month
                  </span>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </>
              );
            } else {
              return <span>Budget Utilization Unchanged this month</span>;
            }
          })()}
        </div>
        <div className="leading-none text-muted-foreground">
          Comparing to the previous month
        </div>
      </CardFooter>
    </Card>
  );
};

export default BudgetUtilization;
