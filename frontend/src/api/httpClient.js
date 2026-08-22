// Base URL of your backend — adjust if it's not running on localhost:3000
const BASE_URL = "http://localhost:3000";

/**
 * Wraps fetch(): attaches the JWT from localStorage as an
 * Authorization header, and throws on non-2xx responses so
 * callers can just use try/catch.
 */
async function httpRequest(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("dayflow_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

export default httpRequest;
