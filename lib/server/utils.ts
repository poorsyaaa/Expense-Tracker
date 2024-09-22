import { getRandomValues } from "crypto";
import {
  startOfMonth,
  endOfMonth,
  endOfToday,
  startOfToday,
  subDays,
  startOfYesterday,
  endOfYesterday,
  endOfWeek,
  startOfWeek,
  endOfYear,
  startOfYear,
  isValid,
  getMonth,
  getYear,
  subMonths,
} from "date-fns";
import { DateRangeOption } from "../schema/dashboard";

export const handleSettledResult = <T>(
  result: PromiseSettledResult<T>,
  defaultValue: T,
): T => {
  if (result.status === "fulfilled") {
    return result.value;
  } else {
    console.error("Error fetching data:", result.reason);
    return defaultValue;
  }
};

export const generateSecureRandomNumber = () => {
  const array = new Uint32Array(1);
  getRandomValues(array);
  return (array[0] % 9000) + 1000;
};

export const generateUsername = (name: string) => {
  let username = name.toLowerCase();
  username = username.replace(/[^a-zA-Z0-9]/g, "");

  if (!username) {
    username = "user";
  }

  return `${username}-${generateSecureRandomNumber()}`;
};

export const getDateRanges = (
  dateRange: DateRangeOption | undefined,
  customStartDate?: string | Date,
  customEndDate?: string | Date,
  baseDate?: Date, // New parameter
): { filterStartDate: Date; filterEndDate: Date } => {
  const currentDate = baseDate || new Date();

  switch (dateRange) {
    case "today":
      return {
        filterStartDate: startOfToday(),
        filterEndDate: endOfToday(),
      };
    case "yesterday":
      return {
        filterStartDate: startOfYesterday(),
        filterEndDate: endOfYesterday(),
      };
    case "last_7_days":
      return {
        filterStartDate: subDays(startOfToday(), 7),
        filterEndDate: endOfToday(),
      };
    case "last_30_days":
      return {
        filterStartDate: subDays(startOfToday(), 30),
        filterEndDate: endOfToday(),
      };
    case "this_week":
      return {
        filterStartDate: startOfWeek(currentDate, { weekStartsOn: 1 }),
        filterEndDate: endOfWeek(currentDate, { weekStartsOn: 1 }),
      };
    case "last_week": {
      const lastWeekStart = subDays(
        startOfWeek(currentDate, { weekStartsOn: 1 }),
        7,
      );
      return {
        filterStartDate: lastWeekStart,
        filterEndDate: endOfWeek(lastWeekStart, { weekStartsOn: 1 }),
      };
    }
    case "this_month":
      return {
        filterStartDate: startOfMonth(currentDate),
        filterEndDate: endOfMonth(currentDate),
      };
    case "last_month": {
      const lastMonthDate = subDays(startOfMonth(currentDate), 1);
      return {
        filterStartDate: startOfMonth(lastMonthDate),
        filterEndDate: endOfMonth(lastMonthDate),
      };
    }
    case "this_year":
      return {
        filterStartDate: startOfYear(currentDate),
        filterEndDate: endOfYear(currentDate),
      };
    case "last_year": {
      const lastYearDate = subDays(startOfYear(currentDate), 1);
      return {
        filterStartDate: startOfYear(lastYearDate),
        filterEndDate: endOfYear(lastYearDate),
      };
    }
    case "custom": {
      if (!customStartDate || !customEndDate) {
        throw new Error("Custom date range requires start and end dates");
      }

      const startDate =
        typeof customStartDate === "string"
          ? new Date(customStartDate)
          : customStartDate;
      const endDate =
        typeof customEndDate === "string"
          ? new Date(customEndDate)
          : customEndDate;

      if (!isValid(startDate) || !isValid(endDate)) {
        throw new Error("Invalid date range");
      }

      if (startDate > endDate) {
        throw new Error("Start date must be before end date");
      }

      return {
        filterStartDate: startDate,
        filterEndDate: endDate,
      };
    }
    default: {
      // Default to current month if no dateRange is provided
      return {
        filterStartDate: startOfMonth(currentDate),
        filterEndDate: endOfMonth(currentDate),
      };
    }
  }
};

export const getLast12Months = (
  baseDate: Date,
): Array<{ year: number; month: number }> => {
  return Array.from({ length: 12 }).map((_, i) => {
    const date = subMonths(baseDate, 11 - i);
    return {
      year: getYear(date),
      month: getMonth(date) + 1, // getMonth() returns 0-11, so add 1
    };
  });
};
