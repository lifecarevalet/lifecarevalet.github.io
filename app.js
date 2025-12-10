const API = "https://lifecarevalet-35b.workers.dev";

let role = "";
let currentUser = null;

function selectRole(r) {
  role = r;
  document.getElementById("loginForm").style.display = "block";
}

async function login() {
  let mobile = document.getElementById("mobile").value;
  let pass = document.getElementById("password").value;

  let res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password: pass, role })
  });

  let data = await res.json();

  if (!data.success) {
    alert("Invalid login");
    return;
  }

  currentUser = data.user;
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
  await fetch(`${API}/token/out`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: outTokenId.value })
  });

  alert("Car Out");
  closeModal();
}