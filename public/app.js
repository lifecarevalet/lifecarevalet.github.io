let role = "";
let currentUser = null;

function selectRole(r) {
  role = r;
  document.getElementById("loginForm").style.display = "block";
}

async function login() {
  let mobile = document.getElementById("mobile").value;
  let pass = document.getElementById("password").value;

  let q = await dbQuery(
    "SELECT * FROM users WHERE mobile=? AND password=? AND role=?",
    [mobile, pass, role]
  );

  if (q.results.length === 0) {
    alert("Invalid login");
    return;
  }

  currentUser = q.results[0];
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

  await dbQuery(
    "INSERT INTO tokens(id,car,customer,cmobile,lane,driver,created) VALUES (?,?,?,?,?,?,datetime('now'))",
    [
      id,
      carNumber.value,
      custName.value,
      custMobile.value,
      parkingLane.value,
      currentUser.name
    ]
  );

  alert("Token Created: " + id);
  closeModal();
}

async function carOut() {
  await dbQuery("DELETE FROM tokens WHERE id=?", [outTokenId.value]);
  alert("Car Out");
  closeModal();
}