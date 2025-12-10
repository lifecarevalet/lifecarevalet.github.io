const API = ""; // FIX: Relative path set

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

  // FIX: Pages Functions ke file name ke hisaab se endpoint call
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
  //... rest of the function remains the same, using 'endpoint'
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

  currentUser = {
      role: role,
      id: data.owner_id || data.driver_id || data.id, 
      name: data.name || "User",
  };
  
  showDashboard();
}

// ... rest of the app.js code
