import { useEffect, useState } from "react"
import styles from "./login.module.css"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { login } from "../../features/authSlice"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { getDeviceInfo } from "../../utils/getDeviceInfo"

export default function Login() {
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuth } = useSelector((state) => state.auth)

  // ✅ Redirect nếu đã login

  useEffect(() => {
      console.log(getDeviceInfo());
      
  }, [])
  if (isAuth) return <Navigate to="/profile" replace />

  const handleChangeEye = () => setShowPw(!showPw)

  const handleChangeInput = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" })) // reset lỗi khi user gõ
  }

  const validateForm = () => {
    const errs = {}

    // email
    if (!form.email.trim()) errs.email = "Email không được để trống"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Email không đúng định dạng"

    // password
    if (!form.password) errs.password = "Mật khẩu không được để trống"
    else if (form.password.length < 8)
      errs.password = "Mật khẩu phải có ít nhất 8 ký tự"
    else if (!/[A-Z]/.test(form.password))
      errs.password = "Mật khẩu phải chứa ít nhất 1 chữ hoa"
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password))
      errs.password = "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const device = getDeviceInfo()
      const payload = await dispatch(login({...form,device: device})).unwrap()
      toast.success(payload.message || "Đăng nhập thành công...")
      if (payload.user.role_id === 3) navigate("/profile")
      else navigate("/")
    } catch (err) {
      toast.error(err.error || err.message || "Đăng nhập thất bại")
      console.log(err)
    }
  }

  return (
    <>
      <div className={styles.title}>ADMIN DASHBOARD</div>
      <div className={styles.card}>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
          <label htmlFor="email">Email :</label>
          <input
            type="text"
            name="email"
            id="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="your email ..."
            value={form.email}
            onChange={handleChangeInput}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}

          <label htmlFor="password">Password :</label>
          <div className="input-group">
            <input
              type={showPw ? "text" : "password"}
              name="password"
              id="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="password ..."
              value={form.password}
              onChange={handleChangeInput}
            />
            <span
              style={{ cursor: "pointer" }}
              onClick={handleChangeEye}
              className="input-group-text"
            >
              <i className={`bi bi-eye${showPw ? "-slash" : ""}`}></i>
            </span>
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <Link to="/forget_password">Quên mật khẩu ?</Link>
          <button type="submit" className="btn btn-primary w-25 m-auto">
            Login
          </button>
        </form>
      </div>
    </>
  )
}
