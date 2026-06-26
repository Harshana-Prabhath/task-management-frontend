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