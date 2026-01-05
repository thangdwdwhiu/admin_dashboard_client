import { useState} from "react"
import { useDispatch } from "react-redux"
import { changePassword } from "../../../features/authSlice"
import { toast } from "react-toastify"

export default function ChangePassword() {
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: ""
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const err = {}

    // password mới
    if (!form.password) {
      err.password = "Mật khẩu không được để trống"
    } else if (form.password.length < 8) {
      err.password = "Mật khẩu phải có ít nhất 8 ký tự"
    } else if (!/[A-Z]/.test(form.password)) {
      err.password = "Mật khẩu phải chứa ít nhất 1 chữ hoa"
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
      err.password = "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
    }

    // confirm
    if (form.confirmPassword !== form.password) {
      err.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    // mật khẩu cũ
    if (!form.currentPassword) {
      err.currentPassword = "Vui lòng nhập mật khẩu hiện tại"
    }

    return err
  }

  const isValid = Object.keys(validate()).length === 0

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    setErrors(err)

    if (Object.keys(err).length > 0) return
    try {
      const res = await dispatch(changePassword(form)).unwrap()
      toast.success(res.message || "Đổi mật khẩu thành công")
    }
    catch(err) {
      console.log(err);
      
      const error = err.error 
      toast.error(error)
    }
    
    console.log("SUBMIT:", form)
  }

  return (
    <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
      {/* current password */}
      <div>
        <label className="form-label">Mật khẩu hiện tại</label>
        <input
          type="password"
          name="currentPassword"
          className={`form-control ${errors.currentPassword ? "is-invalid" : ""}`}
          value={form.currentPassword}
          onChange={handleChange}
        />
        {errors.currentPassword && (
          <div className="invalid-feedback">{errors.currentPassword}</div>
        )}
      </div>

      {/* new password */}
      <div>
        <label className="form-label">Mật khẩu mới</label>
        <input
          type="password"
          name="password"
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password}</div>
        )}
      </div>

      {/* confirm */}
      <div>
        <label className="form-label">Xác nhận mật khẩu mới</label>
        <input
          type="password"
          name="confirmPassword"
          className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <div className="invalid-feedback">{errors.confirmPassword}</div>
        )}
      </div>

      <button className="btn btn-primary align-self-start" disabled={!isValid}>
        Cập nhật mật khẩu
      </button>
     <div> <i className="bi bi-info-circle text-warning"> </i>Nhằm bảo mật, thao tác này sẽ đăng xuất ra toàn bộ các thiết bị đang đăng nhập </div>
    </form>
  )
}
