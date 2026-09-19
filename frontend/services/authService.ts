const API_URL = "http://localhost:3001";

export type AuthUser = {
  id: number;
  email: string;
};

type LoginResponse = {
  accessToken: string;
};

export async function registerUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Registration failed");
  }

  return data;
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data: LoginResponse | { message: string } = await response.json();

  if (!response.ok) {
    throw new Error("message" in data ? data.message : "Login failed");
  }

  if (!("accessToken" in data)) {
    throw new Error("Access token missing");
  }

  localStorage.setItem("accessToken", data.accessToken);

  return data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    localStorage.removeItem("accessToken");
    throw new Error("Session expired. Please log in again.");
  }

  return response.json();
}

export function logoutUser() {
  localStorage.removeItem("accessToken");
}
