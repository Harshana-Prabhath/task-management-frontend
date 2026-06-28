import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { Task, Status, Priority } from "../../types/task.types";
import { useGetAllUsers } from "../../hooks/useUserHooks";

interface TaskModalProps {
  initial: Task | null;
  role: "User" | "Admin";
  isReadOnly?: boolean; 
  onClose: () => void;
  onSave: (task: Task) => void;
}



function FloatingField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.02] px-4 pb-2.5 pt-5 transition-colors focus-within:border-white/30">
      <span className="pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-[#0B0F19] px-2 text-[11px] font-medium uppercase tracking-wide text-white/40">
        {label}
      </span>
      {children}
    </div>
  );
}

export const TaskModal: React.FC<TaskModalProps> = ({ initial, role, isReadOnly = false, onClose, onSave }) => {

 const { data: teamMembers = [], isLoading: isLoadingUsers } = useGetAllUsers(role === "Admin");

  const [draft, setDraft] = useState<Task>(
    initial ?? { id: "", title: "", description: "", status: "Open", priority: "Medium", assignee: "", dueDate: "" }
  );

  useEffect(() => {
    if (initial && teamMembers.length > 0) {
      const matchingMember = teamMembers.find(
        (m) => m.email.toLowerCase() === initial.assignee.toLowerCase() || m.id === initial.assignee
      );
      if (matchingMember) {
        setDraft((prev) => ({ ...prev, assignee: matchingMember.id }));
      }
    }
  }, [teamMembers, initial]);

  const isEdit = Boolean(initial);
  const inputClass = "w-full bg-transparent text-sm text-white placeholder-white/30 outline-none disabled:text-white/60";

  function update<K extends keyof Task>(key: K, value: Task[K]) {
    if (isReadOnly) return;
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isReadOnly || !draft.title.trim()) return;
    onSave({ ...draft, id: draft.id || `t${Date.now()}` });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#10162A] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {isReadOnly ? "Task Details" : isEdit ? "Edit Task" : "Create New Task"}
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FloatingField label="Title">
            <input type="text" value={draft.title} onChange={(e) => update("title", e.target.value)} disabled={isReadOnly} placeholder="Task title" className={inputClass} required />
          </FloatingField>

          <FloatingField label="Description">
            <textarea value={draft.description} onChange={(e) => update("description", e.target.value)} disabled={isReadOnly} placeholder="No description provided." rows={3} className={`${inputClass} resize-none`} required />
          </FloatingField>

          <div className="grid grid-cols-2 gap-4">
            <FloatingField label="Priority">
              <select value={draft.priority} onChange={(e) => update("priority", e.target.value as Priority)} disabled={isReadOnly} className="w-full appearance-none bg-transparent text-sm text-white outline-none disabled:opacity-70 [&>option]:bg-[#10162A]">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </FloatingField>

            <FloatingField label="Status">
              <select value={draft.status} onChange={(e) => update("status", e.target.value as Status)} disabled={isReadOnly} className="w-full appearance-none bg-transparent text-sm text-white outline-none disabled:opacity-70 [&>option]:bg-[#10162A]">
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Testing">Testing</option>
                <option value="Done">Done</option>
              </select>
            </FloatingField>
          </div>

          <FloatingField label="Due Date">
            <input type="date" value={draft.dueDate} onChange={(e) => update("dueDate", e.target.value)} disabled={isReadOnly} className={`${inputClass} [color-scheme:dark]`} required />
          </FloatingField>

          {role === "Admin" && (
            <FloatingField label="Assign Task To">
              {isLoadingUsers ? (
                <div className="flex items-center gap-2 text-xs text-white/40 py-0.5">
                  <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
                  <span>Loading team members...</span>
                </div>
              ) : (
                <select 
                  value={draft.assignee} 
                  onChange={(e) => update("assignee", e.target.value)} 
                  disabled={isReadOnly} 
                  className="w-full appearance-none bg-transparent text-sm text-white outline-none disabled:opacity-70 [&>option]:bg-[#10162A]"
                  required
                >
                  <option value="">-- Select Team Member --</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name ? `${member.name} (${member.email})` : member.email}
                    </option>
                  ))}
                </select>
              )}
            </FloatingField>
          )}

          {!isReadOnly && (
            <div className="mt-2 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5">Cancel</button>
              <button type="submit" className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0B0F19] shadow-md transition-transform active:scale-[0.98]">
                {isEdit ? "Save Changes" : "Create Task"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};