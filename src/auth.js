const API_BASE = "http://localhost:8000";

// ✅ Read csrftoken cookie set by Django
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// ✅ Ensure csrftoken cookie exists
export async function ensureCsrf() {
  await fetch(`${API_BASE}/api/csrf/`, {
    method: "GET",
    credentials: "include",
  });
}

// ✅ Ask Django: who am I?
// If 401/403 => not logged in (or admin blocked)
export async function fetchMe() {
  const res = await fetch(`${API_BASE}/api/me/`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) return null;

  const data = await res.json().catch(() => null);
  return data;
}

// ✅ Login (user-only, admin will be blocked by backend)
export async function loginUser(email, password) {
  await ensureCsrf();
  const csrfToken = getCookie("csrftoken");

  const res = await fetch(`${API_BASE}/api/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken || "",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// ✅ Logout (for React user session)
export async function logoutUser() {
  await ensureCsrf();
  const csrfToken = getCookie("csrftoken");

  const res = await fetch(`${API_BASE}/api/logout/`, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken || "" },
    credentials: "include",
  });

  return res.ok;
}
