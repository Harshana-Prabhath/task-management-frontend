import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Task, Status, Priority } from "../../types/task.types";
import { useGetAllUsers } from "../../hooks/useUserHooks";
import { FloatingField } from "../ui/FloatingField";
import { taskSchema, getFieldErrors } from "../../validations/schemas";

interface TaskModalProps {
  initial: Task | null;
  role: "User" | "Admin";
  isReadOnly?: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  initial,
  role,
  isReadOnly = false,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const { data: teamMembers = [], isLoading: isLoadingUsers } = useGetAllUsers(
    role === "Admin"
  );

  const [draft, setDraft] = useState<Task>(
    initial ?? {
      id: "",
      title: "",
      description: "",
      status: "Open",
      priority: "Medium",
      assignee: "",
      dueDate: "",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial && teamMembers.length > 0) {
      const matchingMember = teamMembers.find(
        (m) =>
          m.email.toLowerCase() === initial.assignee.toLowerCase() ||
          m.id === initial.assignee
      );
      if (matchingMember) {
        setDraft((prev) => ({ ...prev, assignee: matchingMember.id }));
      }
    }
  }, [teamMembers, initial]);

  const isEdit = Boolean(initial);
  const inputClass =
    "w-full bg-transparent text-sm text-white placeholder-white/30 outline-none disabled:text-white/60";

  function update<K extends keyof Task>(key: K, value: Task[K]) {
    if (isReadOnly) return;
    setDraft((d) => ({ ...d, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  }

  const validateField = (field: keyof Task, value: string) => {
    if (isReadOnly) return;

    if (field === "assignee" && role === "Admin" && !value) {
      setErrors((prev) => ({ ...prev, assignee: "Please select a team member" }));
      return;
    }

    const fieldSchema = (taskSchema.shape as Record<string, any>)[field];
    if (!fieldSchema) return;

    const result = fieldSchema.safeParse(value);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.error.issues[0]?.message || "Invalid input",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isReadOnly) return;

    const result = taskSchema.safeParse(draft);
    const fieldErrors: Record<string, string> = {};

    if (!result.success) {
      const parsedErrors = getFieldErrors(result.error);
      Object.assign(fieldErrors, parsedErrors);
    }

    if (role === "Admin" && !draft.assignee.trim()) {
      fieldErrors.assignee = "Please select a team member";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSave({ ...draft, id: draft.id || `t${Date.now()}` });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#10162A] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {isReadOnly
              ? t("task_modal.details_title")
              : isEdit
              ? t("task_modal.edit_title")
              : t("task_modal.create_title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <FloatingField label={t("task_modal.title")} error={errors.title}>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => update("title", e.target.value)}
              onBlur={() => validateField("title", draft.title)}
              disabled={isReadOnly}
              placeholder={t("task_modal.title_placeholder")}
              className={inputClass}
            />
          </FloatingField>

          <FloatingField label={t("task_modal.description")} error={errors.description}>
            <textarea
              value={draft.description}
              onChange={(e) => update("description", e.target.value)}
              onBlur={() => validateField("description", draft.description)}
              disabled={isReadOnly}
              placeholder={t("task_modal.desc_placeholder")}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </FloatingField>

          <div className="grid grid-cols-2 gap-4">
            <FloatingField label={t("common.priority")} error={errors.priority}>
              <select
                value={draft.priority}
                onChange={(e) => update("priority", e.target.value as Priority)}
                onBlur={() => validateField("priority", draft.priority)}
                disabled={isReadOnly}
                className="w-full appearance-none bg-transparent text-sm text-white outline-none disabled:opacity-70 [&>option]:bg-[#10162A]"
              >
                <option value="Low">{t("common.low")}</option>
                <option value="Medium">{t("common.medium")}</option>
                <option value="High">{t("common.high")}</option>
              </select>
            </FloatingField>

            <FloatingField label={t("common.status")} error={errors.status}>
              <select
                value={draft.status}
                onChange={(e) => update("status", e.target.value as Status)}
                onBlur={() => validateField("status", draft.status)}
                disabled={isReadOnly}
                className="w-full appearance-none bg-transparent text-sm text-white outline-none disabled:opacity-70 [&>option]:bg-[#10162A]"
              >
                <option value="Open">{t("common.open")}</option>
                <option value="In Progress">{t("common.in_progress")}</option>
                <option value="Testing">{t("common.testing")}</option>
                <option value="Done">{t("common.done")}</option>
              </select>
            </FloatingField>
          </div>

          <FloatingField label={t("task_modal.due_date")} error={errors.dueDate}>
            <input
              type="date"
              value={draft.dueDate}
              onChange={(e) => update("dueDate", e.target.value)}
              onBlur={() => validateField("dueDate", draft.dueDate)}
              disabled={isReadOnly}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </FloatingField>

          {role === "Admin" && (
            <FloatingField label={t("task_modal.assign_to")} error={errors.assignee}>
              {isLoadingUsers ? (
                <div className="flex items-center gap-2 text-xs text-white/40 py-0.5">
                  <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
                  <span>{t("task_modal.loading_members")}</span>
                </div>
              ) : (
                <select
                  value={draft.assignee}
                  onChange={(e) => update("assignee", e.target.value)}
                  onBlur={() => validateField("assignee", draft.assignee)}
                  disabled={isReadOnly}
                  className="w-full appearance-none bg-transparent text-sm text-white outline-none disabled:opacity-70 [&>option]:bg-[#10162A]"
                >
                  <option value="">{t("task_modal.select_member")}</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name
                        ? `${member.name} (${member.email})`
                        : member.email}
                    </option>
                  ))}
                </select>
              )}
            </FloatingField>
          )}

          {!isReadOnly && (
            <div className="mt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0B0F19] shadow-md transition-transform active:scale-[0.98]"
              >
                {isEdit ? t("task_modal.save_changes") : t("task_modal.create_task")}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};