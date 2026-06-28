import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../services/api";
import type { ITeamMember } from "../types/user.types";
import toast from "react-hot-toast";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}


export const useGetAllUsers = (isAdmin: boolean) => {
  return useQuery<ITeamMember[], Error>({
    queryKey: ["users", "roster"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ITeamMember[]>>("/users");
      return response.data.data;
    },
    enabled: isAdmin, 
    staleTime: 5 * 60 * 1000, 
  });
};

export const useUpdatePassword = () => {
  return useMutation<ApiResponse<null>, Error, any>({
    mutationFn: async (payload) => {
      const response = await api.put<ApiResponse<null>>("/users/update-password", payload);
      return response.data;
    },
    onSuccess: (responseBody) => {
      toast.success(responseBody.message || "Password updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update password.");
    },
  });
};