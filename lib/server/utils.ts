import { getRandomValues } from "crypto";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  getMonth,
  getYear,
} from "date-fns";

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

export const getDateRanges = (year: number, month: number) => {
  const currentDate = new Date(year, month - 1, 1);
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);

  const previousMonthDate = subMonths(startOfCurrentMonth, 1);
  const startOfPreviousMonth = startOfMonth(previousMonthDate);
  const endOfPreviousMonth = endOfMonth(previousMonthDate);

  return {
    startOfMonth: startOfCurrentMonth,
    endOfMonth: endOfCurrentMonth,
    previousMonth: getMonth(previousMonthDate) + 1, // getMonth returns 0-11
    previousYear: getYear(previousMonthDate),
    startOfPreviousMonth,
    endOfPreviousMonth,
  };
};
