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
