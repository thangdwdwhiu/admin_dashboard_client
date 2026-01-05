import { useDispatch, useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"
import AccountBlocked from "../pages/AccoutBlocked/AccountBlocked"
import { toast } from "react-toastify"
import { logout } from "../features/authSlice"

export default function ProtectedRouter() {
  const { isAuth, loading } = useSelector((state) => state.auth)
  const {user} = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try{
      await dispatch(logout()).unwrap()

    }
    catch (err){
      toast.error(err)
    }
  }

  if (loading) {
    return <div>Loading... 🔃</div>
  }
// KIỂM TRA ĐĂNG NHẬP ===========================
  if (!isAuth) {
    return <Navigate to="/login" replace />
  }
//KIỂM TRA TÀI KHOẢN CON HOẠT ĐỘNG KHÔNG

if (user && (user.status !== "ACTIVE" || user.is_deleted)) {
  handleLogout()
  return <AccountBlocked />
}
  return <Outlet />
}
