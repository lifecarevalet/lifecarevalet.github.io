// Base URL of your deployed Worker
const API_BASE = https://lifecarevalet-35b.workers.dev/api";

// ----------------- Helper -----------------
async function apiRequest(path, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API request failed");
  return data;
}

// ----------------- Auth -----------------
export async function login(username, password) {
  return apiRequest("/login", "POST", { username, password });
}

// ----------------- Admin (Owner) -----------------
export async function addManager(name, username, password, ownerKey) {
  return apiRequest("/admin/manager", "POST", { name, username, password }, ownerKey);
}

export async function addDriver(name, phone, ownerKey) {
  return apiRequest("/admin/driver", "POST", { name, phone }, ownerKey);
}

export async function addPoints(driver_id, points, reason, ownerKey) {
  return apiRequest("/admin/points", "POST", { driver_id, points, reason }, ownerKey);
}

// ----------------- Driver -----------------
export async function getDriverBalance(driver_id) {
  return apiRequest(`/driver/${driver_id}/balance`);
}

export async function listDrivers() {
  return apiRequest("/drivers");
}