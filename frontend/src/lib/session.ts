import { UserSession } from "./types";

const SESSION_KEY = "bookly-session";

export function saveSession(session: UserSession) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): UserSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as UserSession) : null;
}

export function getToken(): string | null {
  return getSession()?.token || null;
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(SESSION_KEY);
}
