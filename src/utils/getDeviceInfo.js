
import { v4 as uuidv4 } from "uuid";


export function getDeviceInfo() {
  // 1. Device ID (persist)
  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem("device_id", deviceId);
  }

  // 2. User Agent
  const userAgent = navigator.userAgent;

  // 3. Platform
  const platform = navigator.platform || "unknown";

  // 4. Device name (simple & readable)
  const deviceName = parseDeviceName(userAgent, platform);

  // 5. Is mobile
  const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);

  // 6. Browser name
  const browser = parseBrowser(userAgent);

  // 7. OS
  const os = parseOS(userAgent);

  return {
    device_id: deviceId,
    device_name: deviceName,
    user_agent: userAgent,
    platform,
    browser,
    os,
    is_mobile: isMobile
  };
}

function parseBrowser(ua) {
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/edge/i.test(ua)) return "Edge";
  return "Unknown Browser";
}

function parseOS(ua) {
  if (/windows nt/i.test(ua)) return "Windows";
  if (/mac os x/i.test(ua)) return "MacOS";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad/i.test(ua)) return "iOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Unknown OS";
}

function parseDeviceName(ua, platform) {
  const browser = parseBrowser(ua);
  const os = parseOS(ua);

  return `${browser} on ${os}`;
}
