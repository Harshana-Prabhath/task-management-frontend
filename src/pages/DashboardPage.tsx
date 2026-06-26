import React, { useState } from "react";
import { ListTodo } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { ControlBar } from "../components/dashboard/ControlBar";
import { TaskCard } from "../components/dashboard/TaskCard";
import { TaskModal } from "../components/modals/TaskModal";
import { DeleteDialog } from "../components/modals/DeleteDialog";
import { useAuth } from "../context/AuthContext";
import type { Task, FilterStatus, FilterPriority } from "../types/task.types";

const INITIAL_TASKS: Task[] = [
  { id: "t1", title: "Design onboarding flow", description: "Craft the full multi-step onboarding sequence.", status: "In Progress", priority: "High", assignee: "harshana@example.com", dueDate: "2026-07-02" },
  { id: "t2", title: "Refactor auth service", description: "Split monolithic auth handler into middleware.", status: "Open", priority: "Medium", assignee: "alex@tasky.io", dueDate: "2026-07-08" },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All Tasks");
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>("All");
  const [searchQuery, setSearchQuery] = useState("");

 
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view" | null>(null);
  const [editTarget, setEditTarget] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (!user) return null;

  const rbacTasks = tasks.filter((task) => {
    if (user.role === "Admin") return true;
    return task.assignee.toLowerCase() === user.email.toLowerCase();
  });

  const counts: Record<FilterStatus, number> = {
    "All Tasks": rbacTasks.length,
    Open: rbacTasks.filter((t) => t.status === "Open").length,
    "In Progress": rbacTasks.filter((t) => t.status === "In Progress").length,
    Testing: rbacTasks.filter((t) => t.status === "Testing").length,
    Done: rbacTasks.filter((t) => t.status === "Done").length,
  };

  const visibleTasks = rbacTasks.filter((task) => {
    if (statusFilter !== "All Tasks" && task.status !== statusFilter) return false;
    if (priorityFilter !== "All" && task.priority !== priorityFilter) return false;
    
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.assignee.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0F19] text-white">
      <Sidebar
        user={user}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        counts={counts}
        onCreateClick={() => { setEditTarget(null); setModalMode("create"); }} 
        onLogout={logout}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        <ControlBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
        />

        <div className="flex-1 overflow-y-auto p-6">
          {visibleTasks.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-white/30">
              <ListTodo className="mb-3 h-10 w-10" />
              <p className="text-sm">No workspace tasks match your parameters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={(t) => { setEditTarget(t); setModalMode("view"); }}  
                  onEdit={(t) => { setEditTarget(t); setModalMode("edit"); }}  
                  onDeleteTrigger={setDeleteId}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      
      {modalMode && (
        <TaskModal
          initial={editTarget}
          role={user.role}
          isReadOnly={modalMode === "view"} 
          onClose={() => setModalMode(null)}
          onSave={(task) => {
            setTasks((prev) => {
              const exists = prev.some((t) => t.id === task.id);
              return exists ? prev.map((t) => (t.id === task.id ? task : t)) : [task, ...prev];
            });
            setModalMode(null);
          }}
        />
      )}

      {deleteId && (
        <DeleteDialog
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            setTasks((prev) => prev.filter((t) => t.id !== deleteId));
            setDeleteId(null);
          }}
        />
      )}
    </div>
  );
}