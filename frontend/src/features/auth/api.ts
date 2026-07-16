import { api } from "../../api/client";

export async function login(data: {
  email: string;
  password: string;
}) {
  const response = await api.post("/auth/login", data);

  return response.data;
}

export async function signup(data: {
  username: string;
  email: string;
  password: string;
}) {
  const response = await api.post("/auth/signup", data);

  return response.data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function me() {
  const response = await api.get("/auth/me");

  return response.data;
}
