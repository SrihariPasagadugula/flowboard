import api from "../lib/axios";

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

export const login = async (data: LoginPayload) => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const register = async (data: LoginPayload) => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
};
