// src/api.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Read csrftoken cookie set by Django
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Ensure CSRF cookie exists (Django sets csrftoken on this endpoint)
export async function ensureCsrfCookie() {
  await fetch(`${API_BASE}/api/csrf/`, {
    method: "GET",
    credentials: "include",
  }).catch(() => {});
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await safeJson(res);
  return { res, data };
}

export async function apiPost(path, body = {}) {
  // Make sure csrftoken cookie exists before POST
  await ensureCsrfCookie();

  const csrfToken = getCookie("csrftoken");

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken || "",
    },
    body: JSON.stringify(body),
  });

  const data = await safeJson(res);
  return { res, data };
}

export { API_BASE };
