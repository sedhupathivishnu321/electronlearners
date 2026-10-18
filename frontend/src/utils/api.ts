// Base URL of the shop backend (FastAPI: catalogue, PayU payments, orders).
//   NEXT_PUBLIC_API_URL=https://jrlearners-api.onrender.com   separate backend host (GitHub repository variable API_URL)
//   NEXT_PUBLIC_API_URL=same-origin                            backend served under /api by the same nginx (docker compose)
//   unset / empty                                              online payment disabled (Cash on Delivery only)
const raw = process.env.NEXT_PUBLIC_API_URL || '';
export const API_URL = raw === 'same-origin' ? '' : raw.replace(/\/$/, '');
export const API_V1 = `${API_URL}/api/v1`;
export const paymentsConfigured = raw !== '';
