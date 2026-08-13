import React from "react";
import { Mail, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Task, Status, Priority } from "../../types/task.types";

interface TaskCardProps {
  task: Task;
  onView: (task: Task) => void; 
  onEdit: (task: Task) => void;
  onDeleteTrigger: (id: string) => void;
}

const statusPillStyles: Record<Status, string> = {
  Open: "bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/20",
  "In Progress": "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/25",
  Testing: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/25",
  Done: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/25",
};

const priorityBadgeStyles: Record<Priority, string> = {
  Low: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/20",
  Medium: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-400/20",
  High: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-400/20",
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onView, onEdit, onDeleteTrigger }) => {
  const { t } = useTranslation();

  const getStatusLabel = (status: Status) => {
    switch (status) {
      case "Open": return t("common.open");
      case "In Progress": return t("common.in_progress");
      case "Testing": return t("common.testing");
      case "Done": return t("common.done");
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case "Low": return t("common.low");
      case "Medium": return t("common.medium");
      case "High": return t("common.high");
    }
  };

  return (
    <article 
      onClick={() => onView(task)} 
      className="group flex flex-col cursor-pointer rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-snug text-white text-pretty">
          {task.title}
        </h3>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityBadgeStyles[task.priority]}`}>
          {getPriorityLabel(task.priority)}
        </span>
      </div>

      <span className={`mb-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusPillStyles[task.status]}`}>
        {getStatusLabel(task.status)}
      </span>

      <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-white/40">
        {task.description}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <span className="flex min-w-0 items-center gap-1.5 text-xs text-white/40">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{task.assignee}</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              onEdit(task);
            }}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            aria-label={t("common.edit")}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              onDeleteTrigger(task.id);
            }}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
            aria-label={t("common.delete")}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
};