import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createSocket } from "../../services/socket/socket";
import { logout } from "../../features/authSlice";

export default function SocketListener() {
  const accessToken = useSelector(state => state.auth.accessToken);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch()

  useEffect(() => {
    if (!accessToken) return;

    // Tạo socket mới với token
    const newSocket = createSocket(accessToken);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("hello", "hello");
    });

    newSocket.on("disconnect", (reason) => {
      console.log(" Socket disconnected:", reason);
    });

    newSocket.on("revoke", async () => {
      toast.warning("phiên đăng nhập hết hạn")
      await dispatch(logout()).unwrap()
    });

    return () => {
      newSocket.disconnect();
    };
  }, [accessToken]);

  return null;
}
