"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Accessible dialog. The overlay + surface are the one place elevation
// (shadow) is allowed in this app; everything else sits flat.
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  side = "center",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /** "center" for modals, "end" for a right-side drawer. */
  side?: "center" | "end";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  const position =
    side === "center"
      ? "items-center justify-center p-[var(--space-md)]"
      : "items-stretch justify-end";

  const shape =
    side === "center"
      ? "rounded-[var(--radius-lg)] max-w-lg"
      : "rounded-none sm:rounded-[var(--radius-lg)] sm:m-[var(--space-sm)] w-full max-w-md";

  return (
    <div
      className={`fixed inset-0 z-[var(--z-modal)] flex ${position}`}
      role="presentation"
    >
      <button
        type="button"
        aria-label="Tutup"
        onClick={onClose}
        className="absolute inset-0 bg-[oklch(24%_0.02_55/0.4)]"
        style={{ whiteSpace: "normal" }}
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={[
          "relative z-[1] flex max-h-[92dvh] w-full flex-col overflow-hidden",
          "border border-[var(--color-rule-2)] bg-[var(--color-surface)]",
          "shadow-[var(--shadow-raised)]",
          shape,
        ].join(" ")}
      >
        <header className="flex items-center justify-between gap-[var(--space-md)] border-b border-[var(--color-rule)] px-[var(--space-lg)] py-[var(--space-md)]">
          <h2 className="text-md">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-[var(--radius-sm)] text-[var(--color-muted)] hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink)]"
            aria-label="Tutup dialog"
          >
            <span aria-hidden className="text-lg leading-none">
              ×
            </span>
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-[var(--space-lg)] py-[var(--space-lg)]">
          {children}
        </div>
        {footer ? (
          <footer className="border-t border-[var(--color-rule)] px-[var(--space-lg)] py-[var(--space-md)]">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
