"use client";

import { CATEGORIES } from "@/lib/mock-data";
import type { Category } from "@/lib/types";

// Category rail. Horizontal scroller on mobile, wraps to a row on larger
// screens. Active state uses the single accent as a highlighter.
export function CategoryRail({
  active,
  onChange,
}: {
  active: Category;
  onChange: (category: Category) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Kategori menu"
      className="flex gap-[var(--space-xs)] overflow-x-auto pb-[var(--space-2xs)] sm:flex-wrap sm:overflow-visible"
    >
      {CATEGORIES.map((category) => {
        const isActive = category.id === active;
        return (
          <button
            key={category.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(category.id)}
            className={[
              "min-h-11 shrink-0 rounded-full border px-[var(--space-md)] text-sm font-semibold transition-colors",
              isActive
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                : "border-[var(--color-rule-2)] text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]",
            ].join(" ")}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
