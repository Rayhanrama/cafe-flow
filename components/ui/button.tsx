import type { ButtonHTMLAttributes } from "react";

type Variant = "solid" | "outline" | "ghost";
type Tone = "accent" | "ink" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  tone?: Tone;
  /** Full-width buttons are the norm inside ticket/cart panels. */
  block?: boolean;
}

const TONE: Record<Tone, { solid: string; outline: string; ghost: string }> = {
  accent: {
    solid:
      "bg-[var(--color-accent)] text-[var(--color-accent-ink)] border border-transparent hover:brightness-95",
    outline:
      "bg-transparent text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]",
    ghost:
      "bg-transparent text-[var(--color-accent)] border border-transparent hover:bg-[var(--color-accent-soft)]",
  },
  ink: {
    solid:
      "bg-[var(--color-ink)] text-[var(--color-paper)] border border-transparent hover:brightness-110",
    outline:
      "bg-transparent text-[var(--color-ink)] border border-[var(--color-rule-2)] hover:bg-[var(--color-paper-2)]",
    ghost:
      "bg-transparent text-[var(--color-ink)] border border-transparent hover:bg-[var(--color-paper-2)]",
  },
  danger: {
    solid:
      "bg-[var(--color-danger)] text-[var(--color-accent-ink)] border border-transparent hover:brightness-95",
    outline:
      "bg-transparent text-[var(--color-danger)] border border-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]",
    ghost:
      "bg-transparent text-[var(--color-danger)] border border-transparent hover:bg-[var(--color-danger-soft)]",
  },
};

export function Button({
  variant = "solid",
  tone = "accent",
  block = false,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center justify-center gap-[var(--space-xs)]",
        "rounded-[var(--radius-md)] px-[var(--space-md)] py-[var(--space-sm)]",
        "text-sm font-semibold tracking-tight",
        "min-h-11 transition-[filter,background-color,border-color] duration-150",
        "disabled:cursor-not-allowed disabled:opacity-45",
        TONE[tone][variant],
        block ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
