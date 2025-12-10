// **FIX: Cloudflare Pages Functions ke liye Base URL ko khaali rakhein**
const API_BASE = ""; 

// ----------------- Helper -----------------
async function apiRequest(path, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  // Owner/Admin functions ke liye, ownerKey ko body mein owner_id ke roop mein bhej rahe hain
  if (token && body) {
    body.owner_id = token; 
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message || data.error || "API request failed");
  return data;
}

// ----------------- Auth -----------------
// NOTE: Login function is now handled directly in app.js
export async function login(username, password) {
  // This is a placeholder now, the actual login is in app.js
  return apiRequest("/owners_login", "POST", { phone: username, password: password });
}

// ----------------- Admin (Owner) -----------------
export async function addManager(name, username, password, ownerKey) {
  // Calls functions/add_manager.js
  // Payload: { owner_id, point_id, name, phone } - Password is not used by the backend file
  return apiRequest("/add_manager", "POST", { 
    name, 
    phone: username, 
    point_id: 1 // Assuming a default point_id for now
  }, ownerKey); 
}

export async function addDriver(name, phone, ownerKey) {
  // Calls functions/add_driver.js
  // Payload: { owner_id, point_id, name, phone }
  return apiRequest("/add_driver", "POST", { 
    name, 
    phone, 
    point_id: 1 // Assuming a default point_id for now
  }, ownerKey); 
}

export async function addPoints(name, address, ownerKey) {
  // Calls functions/add_point.js (for adding a new valet point)
  // Payload: { owner_id, point_name, point_address }
  return apiRequest("/add_point", "POST", { 
    point_name: name, 
    point_address: address 
  }, ownerKey); 
}

// ----------------- Driver -----------------
export async function getDriverBalance(driver_id) {
  // NOTE: Assuming this endpoint exists in functions/driver/[driver_id]/balance.js
  return apiRequest(`/driver/${driver_id}/balance`);
}

export async function listDrivers() {
  // NOTE: Assuming this endpoint exists in functions/drivers.js
  return apiRequest("/drivers");
}
