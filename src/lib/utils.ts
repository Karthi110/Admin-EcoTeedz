import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAmount = (amount: number | null) => {
  if (!amount) {
    amount = 0;
  }

  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
  return formatted;
};

export const generateCombinations = (arrays: string[][]) => {
  let results: string[][] = [];

  const helper = (arr: string[], i: number): void => {
    if (i === arrays.length) {
      results.push(arr);
      return;
    }
    for (let j = 0; j < arrays[i].length; j++) {
      helper([...arr, arrays[i][j]], i + 1);
    }
  };

  helper([], 0);
  return results;
};
