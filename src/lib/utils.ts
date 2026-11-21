import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nameCollator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

// Strip punctuation (e.g. the quotes in `"D" Pull Handles`) so names sort the way a reader expects.
const normalizeName = (value: string) =>
  value
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

export const compareNames = (a = "", b = "") => nameCollator.compare(normalizeName(a), normalizeName(b));

export const sortByName = <T extends { name?: string }>(items: T[]) =>
  [...items].sort((a, b) => compareNames(a.name, b.name));
