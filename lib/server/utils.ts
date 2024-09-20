import { getRandomValues } from "crypto";

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
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;

  const startOfPreviousMonth = new Date(previousYear, previousMonth - 1, 1);
  const endOfPreviousMonth = new Date(previousYear, previousMonth, 0);

  return {
    startOfMonth,
    endOfMonth,
    previousMonth,
    previousYear,
    startOfPreviousMonth,
    endOfPreviousMonth,
  };
};
