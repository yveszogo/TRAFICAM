import { API_URL } from './config';

async function request(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(`Impossible de joindre le serveur (${API_URL}). Vérifiez votre connexion.`);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || `Erreur serveur (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return data;
}

export const api = {
  login: (phone, name) => request('/api/auth/login', { method: 'POST', body: { phone, name } }),
  me: (token) => request('/api/me', { token }),
  listReports: () => request('/api/reports'),
  createReport: (token, report) => request('/api/reports', { method: 'POST', body: report, token }),
};
