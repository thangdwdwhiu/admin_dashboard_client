// import { useEffect } from "react"
// import { socket } from "../services/socket/socket"
// import { useSelector } from "react-redux"

// export default function useSocketAuth() {
//   const { isAuth, accessToken } = useSelector((state) => state.auth)

//   useEffect(() => {
//     if (isAuth && accessToken) {
//       socket.auth = { accessToken }
//       socket.connect()
//     } else {
//       socket.disconnect()
//     }

//     return () => {
//       socket.disconnect()
//     }
//   }, [isAuth, accessToken])
// }
