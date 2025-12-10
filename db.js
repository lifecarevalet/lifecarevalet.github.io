const DB_URL = "https://lifecarevalet-35b.workers.dev";
const DB_AUTH = "YOUR_D1_AUTH_TOKEN"; // <-- yahan apna real token dalna, backend ready hone ke baad

async function dbQuery(sql, params = []) {
  const res = await fetch(DB_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${DB_AUTH}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ sql, params })
  });

  if (!res.ok) {
    throw new Error(`DB request failed: ${res.status}`);
  }

  return await res.json();
}