import { apiClient } from "./client";
import type { LoginPayload } from "../types/auth";

export async function loginAdmin(payload: LoginPayload) {
  const response = await apiClient.post("/auth/login", payload);

  return response.data;
}

export async function logoutAdmin() {
  const response = await apiClient.post("/auth/logout");

  return response.data;
}