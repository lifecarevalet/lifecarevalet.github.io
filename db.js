// **FIX 1: Cloudflare Pages Functions ke liye Base URL ko khaali rakhein**
const API_BASE = ""; 

// ----------------- Helper -----------------
async function apiRequest(path, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  // NOTE: Aapki backend files (e.g., add_manager.js) 'Authorization' header use nahi karti hain, 
  // woh seedhe body mein 'owner_id' leti hain. Hum token ko body mein merge kar denge.
  if (token) {
    if (body) {
      body.owner_id = token; // Assuming ownerKey is passed as token here
    }
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
// NOTE: This function is not used by index.html, but keeping it correct.
export async function login(username, password) {
  return apiRequest("/owners_login", "POST", { phone: username, password: password });
}

// ----------------- Admin (Owner) -----------------
export async function addManager(name, username, password, ownerKey) {
  // FIX 2: Path changed from /admin/manager to /add_manager (functions/add_manager.js)
  // Payload must be: { owner_id, point_id, name, phone }
  // username ko phone maan rahe hain. point_id ko 1 (default) maan rahe hain.
  return apiRequest("/add_manager", "POST", { 
    name, 
    phone: username, 
    // password yahan nahi chahiye according to add_manager.js
    point_id: 1 
  }, ownerKey); // ownerKey will be added as owner_id in apiRequest helper
}

export async function addDriver(name, phone, ownerKey) {
  // FIX 3: Path changed from /admin/driver to /add_driver (functions/add_driver.js)
  // Payload must be: { owner_id, point_id, name, phone }
  return apiRequest("/add_driver", "POST", { 
    name, 
    phone, 
    point_id: 1 
  }, ownerKey); // ownerKey will be added as owner_id in apiRequest helper
}

export async function addPoints(name, address, ownerKey) {
  // FIX 4: Path changed from /admin/points to /add_point (functions/add_point.js)
  // NOTE: Your add_point.js file is for adding a NEW VALET POINT (not adding points/score to a driver).
  // Payload must be: { owner_id, point_name, point_address }
  return apiRequest("/add_point", "POST", { 
    point_name: name, 
    point_address: address 
  }, ownerKey); // ownerKey will be added as owner_id in apiRequest helper
}

// ----------------- Driver -----------------
export async function getDriverBalance(driver_id) {
  // NOTE: This endpoint's implementation is not provided, but the path is set correctly.
  return apiRequest(`/driver/${driver_id}/balance`);
}

export async function listDrivers() {
  // NOTE: This endpoint's implementation is not provided, but the path is set correctly.
  return apiRequest("/drivers");
}
