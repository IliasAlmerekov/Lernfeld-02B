const API_URL = "http://localhost:4000/api";

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  return response.json();
}

export async function getUserTickets() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/tickets/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }
  return response.json();
}

export async function getAllTickets() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/tickets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return response.json();
}
