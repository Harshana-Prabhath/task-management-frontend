export type Status = "Open" | "In Progress" | "Testing" | "Done";
export type Priority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string; 
  dueDate: string;
}

export type FilterStatus = Status | "All Tasks";
export type FilterPriority = Priority | "All";

export interface BackendTask {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; email: string };
  assignedTo: { id: string; email: string } | null;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  assignedToId?: string | null;
}
