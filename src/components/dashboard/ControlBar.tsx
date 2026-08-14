import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { FilterPriority } from "../../types/task.types";

interface ControlBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  priorityFilter: FilterPriority;
  onPriorityFilterChange: (priority: FilterPriority) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  searchValue,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
}) => {
  const { t } = useTranslation();

  return (
    <header className="flex flex-col gap-3 border-b border-white/5 px-6 py-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("dashboard.search_placeholder")}
          className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/30"
        />
      </div>
      <div className="relative sm:w-44">
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value as FilterPriority)}
          className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.02] py-2.5 pl-4 pr-9 text-sm text-white outline-none transition-colors focus:border-white/30 [&>option]:bg-[#0F1424]"
        >
          <option value="All">{t("common.all_priorities")}</option>
          <option value="Low">{t("common.low")}</option>
          <option value="Medium">{t("common.medium")}</option>
          <option value="High">{t("common.high")}</option>
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </header>
  );
};