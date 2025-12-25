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

// "2025-12-06T08:00:53.220798Z" to "yyyy-mm-dd"
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
