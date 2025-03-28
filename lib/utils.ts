import { ChartConfig } from "@/components/ui/chart";
import { type ClassValue, clsx } from "clsx";
import { parseISO, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDev = process.env.NODE_ENV === "development";

export const formatDate = (date: Date | string): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const calculatePercentageChange = (
  current: number,
  previous: number,
): string => {
  if (previous === 0) return "+100";
  const change = ((current - previous) / previous) * 100;
  return (change > 0 ? "+" : "") + change.toFixed(2);
};

export const calculatePercentage = (value: number, other: number) => {
  return ((value / other) * 100).toFixed(2);
};

export const generateChartConfig = (
  data: {
    property: string;
    label: React.ReactNode;
    fill?: string;
    icon?: React.ComponentType;
  }[],
  defaultConfig?: Partial<ChartConfig>,
): ChartConfig => {
  const config: ChartConfig = {};

  data.forEach((item) => {
    config[item.property] = {
      label: item.label,
      ...(item.fill ? { color: item.fill } : {}),
      ...(item.icon ? { icon: item.icon } : {}),
    };
  });

  if (defaultConfig) {
    Object.keys(defaultConfig).forEach((key) => {
      if (!config[key]) {
        config[key] = defaultConfig[key] as ChartConfig[string];
      }
    });
  }

  return config;
};

export const calculateAverages = (
  data: {
    month: string;
    income: number;
    expenses: number;
  }[],
) => {
  const total = data.reduce(
    (acc, item) => {
      acc.income += item.income;
      acc.expenses += item.expenses;
      return acc;
    },
    { income: 0, expenses: 0 },
  );

  const count = data.length;

  return {
    income: count ? total.income / count : 0,
    expenses: count ? total.expenses / count : 0,
  };
};

export const formatPreset = (preset: string) => {
  const presets: { [key: string]: string } = {
    today: "Today",
    yesterday: "Yesterday",
    last_7_days: "Last 7 Days",
    last_30_days: "Last 30 Days",
    this_week: "This Week",
    last_week: "Last Week",
    this_month: "This Month",
    last_month: "Last Month",
    this_year: "This Year",
    last_year: "Last Year",
    custom: "Custom Range",
  };

  return presets[preset] || preset;
};

export const getRelativeDueDate = (dueDate: string): string => {
  const date = parseISO(dueDate);
  return formatDistanceToNow(date, { addSuffix: true });
};

const defaultInitializer = (index: number) => index;

export function createRange<T = number>(
  length: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializer: (index: number) => any = defaultInitializer,
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}
