import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; 
import { api } from "../services/api";

import type { LoginPayload, RegisterPayload, AuthResponse, ApiError } from "../types/auth.types";
import { useAuthStore } from "../store/useAuthStore";

export const useLoginUser = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation<AuthResponse, ApiError, LoginPayload>({
    mutationFn: async (data: LoginPayload) => {
      const response = await api.post<AuthResponse>("/auth/login", data);
      return response.data;
    },
    onSuccess: (responseBody: AuthResponse) => {
     const {token, user} = responseBody.data;
     const normalizedUser = {
        ...user,
        name: user.name || user.email.split("@")[0],
        };
        login(token, normalizedUser);
        toast.success(`Welcome back, ${normalizedUser.name}!`);
        navigate("/task-dashboard", { replace: true });
     
    },
    onError: (error: ApiError) => {
      const errMsg = error.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(errMsg); 
    },
  });
};

export const useRegisterUser = (onRegisterSuccess: () => void) => {
  return useMutation<AuthResponse, ApiError, RegisterPayload>({
    mutationFn: async (data: RegisterPayload) => {
      const response = await api.post<AuthResponse>("/auth/register", data);
      return response.data;
    },
    onSuccess: (responseBody: AuthResponse) => {
      toast.success(responseBody.message || "Account created successfully! Please sign in.");
      onRegisterSuccess();
    },
    onError: (error: ApiError) => {
      const errMsg = error.response?.data?.message || "Registration failed. Try a different email.";
      toast.error(errMsg);
    },
  });
};