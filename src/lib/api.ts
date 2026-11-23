import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra ?? {}) as { userApiUrl?: string; transportApiUrl?: string };
export const USER_API_URL = process.env.EXPO_PUBLIC_USER_API_URL ?? extra.userApiUrl ?? "http://localhost:8000";
export const TRANSPORT_API_URL = process.env.EXPO_PUBLIC_TRANSPORT_API_URL ?? extra.transportApiUrl ?? "http://localhost:3000";

let accessToken: string | null = null;
export function setAccessToken(token: string | null) { accessToken = token; }

async function request<T>(base: string, path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  const response = await fetch(`${base}${path}`, { ...init, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.detail ?? body?.message ?? `API error ${response.status}`);
  return body as T;
}

export type AuthUser = { id: string; email: string; full_name?: string; role: string };
export type TokenPair = { access_token: string; refresh_token: string; token_type: string; expires_in: number };

export const userApi = {
  register: (body: { email: string; password: string; full_name?: string; phone?: string; language?: string }) =>
    request<{ data: AuthUser }>(USER_API_URL, "/api/v1/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: async (body: { email: string; password: string }) => {
    const result = await request<{ data: TokenPair }>(USER_API_URL, "/api/v1/auth/login?session=token", { method: "POST", body: JSON.stringify(body) });
    setAccessToken(result.data.access_token);
    return result;
  },
  me: () => request<{ data: AuthUser }>(USER_API_URL, "/api/v1/me"),
  updateMe: (body: Record<string, unknown>) => request<{ data: AuthUser }>(USER_API_URL, "/api/v1/me", { method: "PATCH", body: JSON.stringify(body) }),
  changePassword: (body: { current_password: string; new_password: string }) => request<void>(USER_API_URL, "/api/v1/me/password", { method: "POST", body: JSON.stringify(body) }),
  closeAccount: (body: { password: string; reason?: string }) => request<void>(USER_API_URL, "/api/v1/me/close", { method: "POST", body: JSON.stringify(body) }),
  requestPasswordReset: (email: string) => request<void>(USER_API_URL, "/api/v1/auth/password-reset/request", { method: "POST", body: JSON.stringify({ email }) }),
  confirmPasswordReset: (token: string, new_password: string) => request<void>(USER_API_URL, "/api/v1/auth/password-reset/confirm", { method: "POST", body: JSON.stringify({ token, new_password }) }),
  verifyEmail: (token: string) => request<void>(USER_API_URL, "/api/v1/auth/email/verify", { method: "POST", body: JSON.stringify({ token }) }),
  logout: () => { setAccessToken(null); },
};

export const transportApi = {
  health: () => request<void>(TRANSPORT_API_URL, "/health"),
  createRequest: (body: unknown, idempotencyKey?: string) => request(TRANSPORT_API_URL, "/transport-requests", {
    method: "POST", headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined, body: JSON.stringify(body),
  }),
  getRequest: (id: string) => request(TRANSPORT_API_URL, `/transport-requests/${id}`),
  getTracking: (id: string) => request(TRANSPORT_API_URL, `/transport-requests/${id}/tracking`),
  history: (limit = 50, offset = 0) => request(TRANSPORT_API_URL, `/trips/history?limit=${limit}&offset=${offset}`),
  listOffers: (id: string) => request(TRANSPORT_API_URL, `/transport-requests/${id}/offers`),
  counterOffer: (requestId: string, offerId: string, body: { amount: number; currency: string; validUntil: string }) => request(TRANSPORT_API_URL, `/transport-requests/${requestId}/offers/${offerId}/counter`, { method: "POST", body: JSON.stringify(body) }),
  acceptOffer: (requestId: string, offerId: string) => request(TRANSPORT_API_URL, `/transport-requests/${requestId}/offers/${offerId}/accept`, { method: "POST", body: "{}" }),
  rejectOffer: (requestId: string, offerId: string) => request(TRANSPORT_API_URL, `/transport-requests/${requestId}/offers/${offerId}/reject`, { method: "POST", body: "{}" }),
  cancelRequest: (requestId: string) => request(TRANSPORT_API_URL, `/transport-requests/${requestId}/cancel`, { method: "POST", body: "{}" }),
  track: (tripId: string, body: { latitude: number; longitude: number; recordedAt: string; sourcePointId: string }) => request(TRANSPORT_API_URL, `/trips/${tripId}/tracking`, { method: "POST", body: JSON.stringify(body) }),
};
