// **FIX: Cloudflare Pages Functions ke liye Base URL ko khaali rakhein**
const API = ""; 

let role = "";
let currentUser = null;

function selectRole(r) {
  role = r;
  document.getElementById("loginForm").style.display = "block";
  // Driver login mein password field chupa diya
  document.getElementById("password").style.display = (role === "driver") ? "none" : "block"; 
}

async function login() {
  let mobile = document.getElementById("mobile").value;
  let pass = document.getElementById("password").value;

  // FIX: Dynamic endpoint and payload based on role
  let endpoint;
  let payload = { phone: mobile }; 
  
  if (role === "driver") {
    endpoint = `${API}/driver_login`; // Calls functions/driver_login.js
  } else if (role === "owner" || role === "manager") {
    endpoint = `${API}/owners_login`; // Calls functions/owners_login.js
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
    alert(data.message || "Invalid login");
    return;
  }

  currentUser = {
      role: role,
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
  // NOTE: Assuming a token create API endpoint exists in functions/token/create.js
  let payload = {
    id,
    car: carNumber.value,
    customer: custName.value,
    cmobile: custMobile.value,
    lane: parkingLane.value,
    driver: currentUser.name,
  };

  await fetch(`${API}/token/create`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  alert("Token Created: " + id);
  closeModal();
}

async function carOut() {
  // NOTE: Assuming a car out API endpoint exists in functions/token/out.js
  await fetch(`${API}/token/out`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: outTokenId.value })
  });

  alert("Car Out");
  closeModal();
}
