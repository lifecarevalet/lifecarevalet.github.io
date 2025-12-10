const DB_URL = "YOUR_D1_ENDPOINT";
const DB_AUTH = "YOUR_D1_AUTH_TOKEN";

async function dbQuery(sql, params = []) {
  const res = await fetch(DB_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${DB_AUTH}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ sql, params })
  });

  return await res.json();
}