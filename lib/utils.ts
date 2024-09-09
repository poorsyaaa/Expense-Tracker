import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getRandomValues } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDev = process.env.NODE_ENV === "development";

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
