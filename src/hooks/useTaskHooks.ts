import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { api } from "../services/api";
import type { Task, BackendTask, CreateTaskPayload } from "../types/task.types";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export const useTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<BackendTask[]>>("/tasks");
      return response.data.data.map((task) => ({
        id: String(task.id),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        assignee: task.assignedTo ? task.assignedTo.email : "Unassigned",
      }));
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<BackendTask>, Error, CreateTaskPayload>({
    mutationFn: async (payload) => {
      const response = await api.post<ApiResponse<BackendTask>>("/tasks", payload);
      return response.data;
    },
    onSuccess: (responseBody) => {
      toast.success(responseBody.message || "Task created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || "Failed to create the task !";
      toast.error(errMsg);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<BackendTask>, Error, { id: string; payload: Partial<CreateTaskPayload> }>({
    mutationFn: async ({ id, payload }) => {
      const response = await api.put<ApiResponse<BackendTask>>(`/tasks/${id}`, payload);
      return response.data;
    },
    onSuccess: (responseBody) => {
      toast.success(responseBody.message || "Task updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update the task.");
    }
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (id) => {
      const response = await api.delete<ApiResponse<null>>(`/tasks/${id}`);
      return response.data;
    },
    onSuccess: (responseBody) => {
      toast.success(responseBody.message || "Task deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete the task.");
    }
  });
};



