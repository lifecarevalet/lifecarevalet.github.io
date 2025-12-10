// **FIX 1: Cloudflare Pages Functions ke liye Base URL ko khaali rakhein**
const API = ""; 

let role = "";
let currentUser = null;

function selectRole(r) {
  role = r;
  document.getElementById("loginForm").style.display = "block";
  // FIX 2: Driver login mein password field chupa diya (driver_login.js ko password nahi chahiye)
  document.getElementById("password").style.display = (role === "driver") ? "none" : "block"; 
}

async function login() {
  let mobile = document.getElementById("mobile").value;
  let pass = document.getElementById("password").value;

  // FIX 3: Dynamic endpoint and payload based on role
  let endpoint;
  let payload = { phone: mobile }; // Sabhi logins ko 'phone' chahiye
  
  if (role === "driver") {
    // Calls functions/driver_login.js -> payload: { phone }
    endpoint = `${API}/driver_login`; 
  } else if (role === "owner" || role === "manager") {
    // Calls functions/owners_login.js -> payload: { phone, password }
    endpoint = `${API}/owners_login`; 
    payload.password = pass;
  } else {
    alert("Please select a role.");
    return;
  }

  let res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  let data = await res.json();
  
  if (!data.success) {
    alert("Invalid login");
    return;
  }

  // FIX 4: Correctly handle response from owners_login.js (returns owner_id, name)
  currentUser = {
      role: role,
      // owner_id ya driver_id ko ID ke roop mein store karein
      id: data.owner_id || data.driver_id || data.id, 
      name: data.name || "User",
  };
  
  showDashboard();
}

function showDashboard() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("roleTitle").innerText = currentUser.role.toUpperCase();

  if (currentUser.role === "driver") {
    document.getElementById("createTokenBtn").style.display = "block";
  }

  if (currentUser.role === "manager") {
    document.getElementById("outBtn").style.display = "block";
  }
}

function openTokenForm() {
  document.getElementById("driverNameShow").innerText = currentUser.name;
  document.getElementById("tokenForm").style.display = "block";
}

function openOutForm() {
  document.getElementById("outForm").style.display = "block";
}

function closeModal() {
  document.getElementById("tokenForm").style.display = "none";
  document.getElementById("outForm").style.display = "none";
}

async function saveToken() {
  let id = Date.now();
  // NOTE: Token creation logic is not in your provided backend files, 
  // but we fix the API path usage here.
  let payload = {
    id,
    car: carNumber.value,
    customer: custName.value,
    cmobile: custMobile.value,
    lane: parkingLane.value,
    driver: currentUser.name,
  };

  await fetch(`${API}/token/create`, { // Assuming /functions/token_create.js exists
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  alert("Token Created: " + id);
  closeModal();
}

async function carOut() {
  // NOTE: Car Out logic is not in your provided backend files.
  await fetch(`${API}/token/out`, { // Assuming /functions/token_out.js exists
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: outTokenId.value })
  });

  alert("Car Out");
  closeModal();
}
