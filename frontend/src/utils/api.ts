// Base URL of the shop backend (FastAPI: catalogue, PayU payments, orders).
//   NEXT_PUBLIC_API_URL=https://jrlearners-api.onrender.com   separate backend host (GitHub repository variable API_URL)
//   NEXT_PUBLIC_API_URL=same-origin                            backend served under /api by the same nginx (docker compose)
//   unset / empty                                              online payment disabled (Cash on Delivery only)
const raw = process.env.NEXT_PUBLIC_API_URL || '';
export const API_URL = raw === 'same-origin' ? '' : raw.replace(/\/$/, '');
export const API_V1 = `${API_URL}/api/v1`;
export const paymentsConfigured = raw !== '';

// ---- session token (sent as `Authorization: Bearer`). It is kept in localStorage so a refresh keeps you signed in.
const TOKEN_KEY = 'jrl_token';
export const getToken = (): string | null => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };
export const setToken = (t: string) => { try { localStorage.setItem(TOKEN_KEY, t); } catch { /* storage blocked */ } };
export const clearToken = () => { try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage blocked */ } };

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

function errorText(data: any, status: number): string {
  const d = data?.detail;
  if (Array.isArray(d)) return d.map((x: { loc?: string[]; msg: string }) => `${(x.loc || []).slice(-1)[0] ?? ''}: ${x.msg}`).join('; ');
  return typeof d === 'string' ? d : `Request failed (${status})`;
}

/** JSON request to the backend. Throws ApiError with the server's message. */
export async function api<T = any>(path: string, init: { method?: string; body?: unknown; auth?: boolean } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (init.body !== undefined) headers['Content-Type'] = 'application/json';
  const token = init.auth === false ? null : getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  let res: Response;
  try {
    res = await fetch(`${API_V1}${path}`, { method: init.method || (init.body !== undefined ? 'POST' : 'GET'), headers, body: init.body !== undefined ? JSON.stringify(init.body) : undefined });
  } catch {
    throw new ApiError(0, 'Could not reach the server. Please check your connection and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, errorText(data, res.status));
  return data as T;
}

/** Only same-site paths are allowed as a post-sign-in destination (no open redirects). */
export const safeNext = (value: unknown, fallback = '/dashboard'): string => {
  const v = typeof value === 'string' ? value : '';
  return v.startsWith('/') && !v.startsWith('//') ? v : fallback;
};
