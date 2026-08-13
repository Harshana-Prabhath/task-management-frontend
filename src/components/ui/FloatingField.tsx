import React from "react";

interface FloatingFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function FloatingField({ label, error, children }: FloatingFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`relative rounded-xl border px-4 pb-2.5 pt-5 transition-colors ${
          error
            ? "border-red-500/80 bg-red-500/[0.05] focus-within:border-red-500"
            : "border-white/10 bg-white/[0.02] focus-within:border-white/30"
        }`}
      >
        <span
          className={`pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-[#0B0F19] px-2 text-[11px] font-medium uppercase tracking-wide ${
            error ? "text-red-400" : "text-white/40"
          }`}
        >
          {label}
        </span>
        {children}
      </div>
      {error && (
        <p className="px-1 text-[11px] font-medium text-red-400">{error}</p>
      )}
    </div>
  );
}