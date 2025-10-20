"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

function usePortalElement() {
  const element =
    typeof window !== "undefined"
      ? (document.getElementById("modal-root") as HTMLDivElement | null)
      : null;

  if (!element && typeof window !== "undefined") {
    const created = document.createElement("div");
    created.id = "modal-root";
    document.body.appendChild(created);
    return created;
  }

  return element;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
}: ModalProps) {
  const container = usePortalElement();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !container) {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 px-4 pb-6 pt-12 sm:items-center sm:px-6"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl focus:outline-none",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Close"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <h2 id="modal-title" className="text-lg font-semibold text-foreground">
          {title}
        </h2>
        <div className="mt-4 text-sm text-muted-foreground">{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>,
    container,
  );
}
