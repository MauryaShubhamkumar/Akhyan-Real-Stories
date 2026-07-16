import { api } from "../../api/client";

export async function getProfile() {
  const response = await api.get("/profile");

  return response.data;
}

export async function updateProfile(
  data: {
    bio: string;
    employment: string;
    education: string;
    location: string;
  }
) {
  const response = await api.patch(
    "/profile",
    data
  );

  return response.data;
}
