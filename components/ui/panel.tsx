import type { ReactNode } from "react";

// A quiet bordered surface. No shadow by default — most surfaces sit flat and
// hierarchy comes from scale and weight, per Hallmark's depth rule.
export function Panel({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "aside" | "article";
}) {
  return (
    <Tag
      className={[
        "rounded-[var(--radius-lg)] border border-[var(--color-rule)]",
        "bg-[var(--color-surface)]",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}

// Section heading pattern: stacked, deliberate left alignment. No eyebrow /
// number paired beside the heading (banned by Hallmark slop-test gate 54).
export function SectionHead({
  title,
  hint,
  className = "",
}: {
  title: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="text-2xl">{title}</h2>
      {hint ? (
        <p className="mt-[var(--space-2xs)] max-w-[52ch] text-sm text-[var(--color-muted)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
