import httpRequest from "./httpClient";

export function signup({ email, password, role, name, phone, address }) {
  return httpRequest("/api/auth/signup", {
    method: "POST",
    body: { email, password, role, name, phone, address },
  });
}

export function signin({ email, password }) {
  return httpRequest("/api/auth/signin", {
    method: "POST",
    body: { email, password },
  });
}
