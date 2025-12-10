// Base URL of your deployed Worker. Set to "" for Cloudflare Pages Functions.
const API_BASE = ""; // FIX 1: Hardcoded URL ko hata kar relative path set kiya

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
  // NOTE: 'login' function is not used directly in index.html, it's inlined in app.js
  return apiRequest("/owners_login", "POST", { username, password }); // Ise '/owners_login' set kiya
}

// ----------------- Admin (Owner) -----------------
export async function addManager(name, username, password, ownerKey) {
  // FIX 2: Path changed from /admin/manager to /add_manager (functions/add_manager.js)
  return apiRequest("/add_manager", "POST", { name, username: username, phone: username, password: password, owner_id: ownerKey }); // Payload updated
}

export async function addDriver(name, phone, ownerKey) {
  // FIX 3: Path changed from /admin/driver to /add_driver (functions/add_driver.js)
  return apiRequest("/add_driver", "POST", { name, phone, owner_id: ownerKey }); // Payload updated
}

export async function addPoints(driver_id, points, reason, ownerKey) {
  // FIX 4: Path changed from /admin/points to /add_point (functions/add_point.js)
  return apiRequest("/add_point", "POST", { driver_id, points, reason, owner_id: ownerKey }); // Payload updated
}

// ----------------- Driver -----------------
export async function getDriverBalance(driver_id) {
  // NOTE: '/driver/...' and '/drivers' endpoints ke liye files available nahi hain.
  // Yeh API call deployment ke baad fail ho sakti hai.
  return apiRequest(`/driver/${driver_id}/balance`);
}

export async function listDrivers() {
  return apiRequest("/drivers");
}
