import type { Category } from "../types";

export interface CategoryOption {
  label: string;
  value: Category | "";
}

export const categories: CategoryOption[] = [
  { label: "All", value: "" },
  { label: "Struggles", value: "struggle" },
  { label: "Love Stories", value: "love" },
  { label: "School Life", value: "school" },
  { label: "College Life", value: "college" },
  { label: "General", value: "general" },
];

export const categoryLabels: Record<Category, string> = {
  struggle: "Struggle",
  love: "Love Story",
  school: "School Life",
  college: "College Life",
  general: "General",
};
