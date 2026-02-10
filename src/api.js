const API_BASE = "http://localhost:8000";

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export async function apiPost(path, body = {}) {
  const csrfRes = await fetch(`${API_BASE}/api/csrf/`, {
    method: "GET",
    credentials: "include",
  });

  // read csrftoken cookie
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken || "",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export { API_BASE };
