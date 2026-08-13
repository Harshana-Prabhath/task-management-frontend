import React from "react";
import { Plus, LogOut, ListTodo, Circle, Loader2, FlaskConical, CheckCheck, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { FilterStatus } from "../../types/task.types";
import { useNavigate } from "react-router-dom";
import { LanguageToggle } from "../ui/LaungageToggle";

interface SidebarProps {
  user: { name: string; role: string };
  activeFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  counts: Record<FilterStatus, number>;
  onCreateClick: () => void;
  onLogout: () => void;
}

const statusIcons: Record<FilterStatus, any> = {
  "All Tasks": ListTodo,
  Open: Circle,
  "In Progress": Loader2,
  Testing: FlaskConical,
  Done: CheckCheck,
};

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeFilter,
  onFilterChange,
  counts,
  onCreateClick,
  onLogout,
}) => {
  const { t } = useTranslation();
  const items: FilterStatus[] = ["All Tasks", "Open", "In Progress", "Testing", "Done"];
  const navigate = useNavigate();

  const getStatusTranslation = (status: FilterStatus) => {
    switch (status) {
      case "All Tasks": return t("common.all_tasks");
      case "Open": return t("common.open");
      case "In Progress": return t("common.in_progress");
      case "Testing": return t("common.testing");
      case "Done": return t("common.done");
    }
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/5 bg-[#0F1424]">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-base font-black text-[#0B0F19]">
            T
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">Tasky</span>
        </div>
        <LanguageToggle />
      </div>

      <button 
        onClick={() => navigate("/profile")}
        className="mx-3 flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left transition-colors hover:bg-white/5 group focus:outline-none focus:ring-1 focus:ring-white/20"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500 text-base font-bold uppercase text-white">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{user.name}</p>
            <span className="mt-0.5 inline-block rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/50">
              {user.role === "Admin" ? t("common.admin") : t("common.user")}
            </span>
          </div>
        </div>
        <Settings className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors shrink-0 ml-1" />
      </button>

      <div className="px-3 py-4">
        <button
          onClick={onCreateClick}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-sm font-semibold text-[#0B0F19] shadow-[0_0_20px_-6px_rgba(255,255,255,0.5)] transition-transform focus:outline-none focus:ring-2 focus:ring-white/40 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> {t("dashboard.create_new_task")}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/30">
          {t("common.status")}
        </p>
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = statusIcons[item];
            const active = activeFilter === item;
            return (
              <li key={item}>
                <button
                  onClick={() => onFilterChange(item)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "bg-white/10 font-medium text-white" : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${item === "In Progress" && active ? "animate-spin" : ""}`} />
                    {getStatusTranslation(item)}
                  </span>
                  <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${active ? "bg-white/15 text-white" : "bg-white/5 text-white/40"}`}>
                    {counts[item] || 0}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/5 p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> {t("dashboard.log_out")}
        </button>
      </div>
    </aside>
  );
};