import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert camelCase to normal case
export function camelToNormalCase(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1") // Insert space before capital letters
    .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
}
