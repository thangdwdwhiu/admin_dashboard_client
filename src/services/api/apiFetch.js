import { getAccessToken, setAccessToken } from '../authTokens';

const baseUrl = import.meta.env.VITE_API_URL || '';

async function refreshOnce() {
  try {
    const r = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!r.ok) return null;

    const data = await r.json();
    if (data.accessToken) setAccessToken(data.accessToken);
    return data.accessToken || null;
  } catch (e) {
    console.error('refresh error', e);
    return null;
  }
}

export default async function apiFetch(path, opts = {}) {
  const url = path.startsWith('http') ? path : baseUrl + path;
  const options = { credentials: 'include', ...opts };

  const headers = new Headers(options.headers || {});

// xu li body + headers
  if (options.body && !(options.body instanceof FormData) && typeof options.body === 'object') {
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    options.body = JSON.stringify(options.body);
  }

  // set Authorization nếu có token
  const access = getAccessToken();
  if (access) headers.set('Authorization', `Bearer ${access}`);
  options.headers = headers;

  // goi lan dau
  let res = await fetch(url, options);
  if (res.status !== 401) return res;

// thu refresh lan 1
  const fresh = await refreshOnce();
  if (!fresh) {
    setAccessToken(null);
    throw { message: 'Unauthorized', code: 'UNAUTHORIZED' };
  }

 // thu lai voi token moi
  headers.set('Authorization', `Bearer ${fresh}`);
  options.headers = headers;
  res = await fetch(url, options);
  if (res.status === 401) {
    setAccessToken(null);
    throw { message: 'Unauthorized', code: 'UNAUTHORIZED' };
  }

  return res;
}

// Helpers login/logout
export const saveTokens = ({ accessToken }) => {
  if (accessToken) setAccessToken(accessToken);
};
export const clearTokens = () => setAccessToken(null);
