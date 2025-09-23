// src/lib/api.js
const BASE_URL = "https://rice-mill-tracker-production.up.railway.app/v1";

export async function apiRequest(endpoint, method = "GET", body, token) {
  console.log(token);
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API request failed");
  }

  return res.json();
}
