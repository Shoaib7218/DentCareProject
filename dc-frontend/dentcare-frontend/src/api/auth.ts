import api from "./axios";
import type { AuthResponse, LoginRequest, RegisterRequest, VerifyOtpRequest, ResendOtpRequest } from "../types";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<string> => {
  const response = await api.post<string>("/api/auth/register", data);
  return response.data;
};

export const verifyOtp = async (data: VerifyOtpRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/verify-otp", data);
  return response.data;
};

export const resendOtp = async (data: ResendOtpRequest): Promise<string> => {
  const response = await api.post<string>("/api/auth/resend-otp", data);
  return response.data;
};