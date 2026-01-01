import { useDispatch, useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"
import { checkAuth } from "../features/authSlice"
import { useEffect } from "react"
import AccountBlocked from "../pages/AccoutBlocked/AccountBlocked"

export default function ProtectedRouter() {
  const { isAuth, loading } = useSelector((state) => state.auth)
  const {user} = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handelCheckAuth = async () =>{
    try{
     await dispatch(checkAuth()).unwrap()
    }
    catch(err) {
      console.log(err)
      return <Navigate to={"/login"} replace/>

    }
  }
  useEffect(() =>{
    handelCheckAuth()
  }, [])
  if (loading) {
    return <div>Loading... 🔃</div>
  }
// KIỂM TRA ĐĂNG NHẬP ===========================
  if (!isAuth) {
    return <Navigate to="/login" replace />
  }
//KIỂM TRA TÀI KHOẢN CON HOẠT ĐỘNG KHÔNG
if (!user || user.status !== "ACTIVE" || user.is_deleted){
  return <AccountBlocked />
}
  return <Outlet />
}
