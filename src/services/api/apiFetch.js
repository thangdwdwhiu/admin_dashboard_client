// apiFetch: wrapper gọn, an toàn cho accessToken + refreshToken
// - Lấy accessToken từ dịch vụ `authTokens` (module nhỏ, tránh circular import)
// - Khi gặp 401 sẽ thử refresh 1 lần rồi thử lại
// - Nếu refresh thất bại: clear token và ném lỗi để UI xử lý (logout/redirect)

import { getAccessToken, setAccessToken } from '../authTokens'

const baseUrl = import.meta.env.VITE_API_URL || '';

// Gọi API refresh — giả định server dùng cookie httpOnly cho refreshToken (credentials: include)
// và trả về { accessToken, ... } khi thành công.
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

// async function parseResponse(res) {
//     const contentType = (res.headers && res.headers.get ? res.headers.get('content-type') : '') || '';
//     if (res.ok) {
//         if (contentType.includes('application/json')) return await res.json();
//         return await res.text();
//     }
//     // lỗi từ server: cố parse body
//     try {
//         const body = contentType.includes('application/json') ? await res.json() : await res.text();
//         throw (body && body.error) ? body : { message: body || res.statusText, status: res.status };
//     } catch (e) {
//         throw { message: res.statusText || 'Request failed', status: res.status };
//     }
// }

export default async function apiFetch(path, opts = {}) {
    const url = path.startsWith('http') ? path : baseUrl + path;
    const options = { credentials: 'include', ...opts };

    const headers = new Headers(options.headers || {});
    // Nếu gửi body JS Object mà caller không set header, mặc định là JSON
    if (!headers.has('Content-Type') && options.body && typeof options.body === 'object') {
        headers.set('Content-Type', 'application/json');
        options.body = JSON.stringify(options.body);
    }

    const access = getAccessToken();
    if (access) headers.set('Authorization', `Bearer ${access}`);
    options.headers = headers;

    // 1. Thử call lần đầu
    let res = await fetch(url, options);
    if (res.status !== 401) return res;

    // 2. Nếu 401 thử refresh 1 lần
    const fresh = await refreshOnce();
    if (!fresh) {
        // không thể refresh -> clear token trong redux và ném lỗi
        setAccessToken(null);
        throw { message: 'Unauthorized', code: 'UNAUTHORIZED' };
    }

    // 3. Thử lại với token mới
    headers.set('Authorization', `Bearer ${fresh}`);
    options.headers = headers;
    res = await fetch(url, options);
    if (res.status === 401) {
        setAccessToken(null);
        throw { message: 'Unauthorized', code: 'UNAUTHORIZED' };
    }
    return res;
}

// Helpers để dùng khi login/logout
export const saveTokens = ({ accessToken }) => {
    if (accessToken) setAccessToken(accessToken);
};
export const clearTokens = () => {
    setAccessToken(null);
};