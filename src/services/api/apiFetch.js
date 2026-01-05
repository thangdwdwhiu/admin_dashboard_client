import { toast } from 'react-toastify';
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

  // xử lý body
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    typeof options.body === 'object'
  ) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    options.body = JSON.stringify(options.body);
  }

  // gắn access token
  const access = getAccessToken();
  if (access) headers.set('Authorization', `Bearer ${access}`);
  options.headers = headers;

  // ===== CALL LẦN 1 =====
  let res = await fetch(url, options);
  if (res.status !== 401) return res;

  // ===== ĐỌC BODY LỖI =====
  let errorData = null;
  try {
    errorData = await res.clone().json();
  } catch {}

  const errorCode = errorData?.code;

  // 🚨 SESSION / DEVICE BỊ REVOKE → LOGOUT NGAY
  if (errorCode === 'SESSION_REVOKED') {
    setAccessToken(null);
    await fetch(`${baseUrl}/api/auth/logout`, {
        method: "DELETE",
        credentials: "include"
    })
    window.location.href = "/login"
    toast.warning("Phiên đăng nhập hết hạn")
    throw errorData;
  }

  // ❌ TOKEN KHÔNG HỢP LỆ → LOGOUT
  if (errorCode === 'UNAUTHORIZED') {
    setAccessToken(null);
    window.location.href = '/login';
    throw errorData;
  }

  // ===== CHỈ REFRESH KHI TOKEN HẾT HẠN =====
  const fresh = await refreshOnce();
  if (!fresh) {
    setAccessToken(null);
    window.location.href = '/login';
    throw { message: 'Refresh failed', code: 'REFRESH_TOKEN_INVALID' };
  }

  // ===== CALL LẠI VỚI TOKEN MỚI =====
  headers.set('Authorization', `Bearer ${fresh}`);
  options.headers = headers;

  res = await fetch(url, options);
  if (res.status === 401) {
    setAccessToken(null);
    window.location.href = '/login';
    throw { message: 'Unauthorized', code: 'UNAUTHORIZED' };
  }

  return res;
}

// ===== Helpers =====
export const saveTokens = ({ accessToken }) => {
  if (accessToken) setAccessToken(accessToken);
};

export const clearTokens = () => setAccessToken(null);
