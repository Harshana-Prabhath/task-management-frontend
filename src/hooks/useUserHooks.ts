import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { ITeamMember } from "../types/user.types";

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