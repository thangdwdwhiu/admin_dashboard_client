import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import PageNotFound from "../pages/PageNotFound/PageNotFound"

export default function RequireRole({ roles }) {
  const role = useSelector(state => state.user.user?.role_id)
  console.log(useSelector(state => state.user.user));
  
  return roles.includes(role)
    ? <Outlet />
    : <PageNotFound />
}
