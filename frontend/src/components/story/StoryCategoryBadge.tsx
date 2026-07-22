import { categoryLabels } from "../../constants/categories";
import type { Category } from "../../types";
import { cn } from "../../lib/cn";
import { Flame, Heart, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

const categoryIcons: Record<Category, ComponentType<{ size?: number; className?: string }>> = {
  struggle: Flame,
  love: Heart,
  school: BookOpen,
  college: GraduationCap,
  general: Sparkles,
};

const badgeClass: Record<Category, string> = {
  struggle: "badge-struggle",
  love: "badge-love",
  school: "badge-school",
  college: "badge-college",
  general: "badge-general",
};

interface Props {
  category: Category;
  showIcon?: boolean;
}

export default function StoryCategoryBadge({
  category,
  showIcon = true,
}: Props) {
  const Icon = categoryIcons[category];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide select-none transition-all duration-200",
        badgeClass[category]
      )}
    >
      {showIcon && Icon && <Icon size={12} />}
      {categoryLabels[category]}
    </span>
  );
}
