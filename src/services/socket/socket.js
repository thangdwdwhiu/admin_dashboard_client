// services/socket/socket.js
import { io } from "socket.io-client";

export const createSocket = (accessToken) => {
  return io(import.meta.env.VITE_API_URL, {
    autoConnect: true,
    withCredentials: true,
    transports: ["websocket"],
    auth: { token: accessToken } // gán token ngay lúc tạo socket
  });
};
