import { api } from "../../lib/axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export const login = async (data: LoginRequest) => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const register = async (data: RegisterRequest) => {
  const response = await api.post<RegisterResponse>("/auth/register", data);
  return response.data;
};
