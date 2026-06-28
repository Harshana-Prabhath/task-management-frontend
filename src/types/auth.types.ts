export type Role = "User" | "Admin";

export interface UserSession {
  id: string;
  name?: string; 
  email: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  role: Role;
}

export interface AuthResponse {
  status: "success" | "error";
  message: string;
  data: {
    token: string;
    user: UserSession;
  };
}

export interface ApiError {
  response?: {
    data?: {
      status?: string;
      message?: string;
    };
  };
}

