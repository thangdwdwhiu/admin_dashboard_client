// Lightweight module-scoped token holder to avoid circular Redux imports
// Lưu accessToken trong biến module (không dùng localStorage) và cung cấp getter/setter
let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (t) => { accessToken = t || null };
export const clearAccessToken = () => { accessToken = null };

export default { getAccessToken, setAccessToken, clearAccessToken };
