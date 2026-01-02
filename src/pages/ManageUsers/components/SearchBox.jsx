import { useState } from "react"
import { useDispatch } from "react-redux"
import { addOneUser, setFilters } from "../../../features/userListSlice"
import store from "../../../store/store"

export default function SearchBox() {
    const dispatch = useDispatch()
    const [showForm, setShowForm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [serverError, setServerError] = useState(null)
    const [validationErrors, setValidationErrors] = useState([])
    const [form, setForm] = useState({ full_name: "", email: "", password: "", role_id: 3 })
    const [role, setRole] = useState("all")
    const [searchInput, setSearchInput] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((s) => ({ ...s, [name]: value }))
    }
    const handleChangeRole = (e) => {
        const v = e.target.value
        setRole(v)
        dispatch(setFilters({ role: v }))
    }

    const handleSearchInput = (e) => {
        const v = e.target.value
        setSearchInput(v)
        dispatch(setFilters({ keyword: v }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setServerError(null)
        setValidationErrors([])

        
        const errors = []
        const name = (form.full_name || '').trim()
        const email = (form.email || '').trim()
        const password = form.password || ''
        const roleId = parseInt(form.role_id, 10)

        if (!name) errors.push('Họ và tên không được để trống')
        else if (name.length < 3) errors.push('Họ và tên phải có ít nhất 3 ký tự')

        const emailRe = /\S+@\S+\.\S+/
        if (!email) errors.push('Email không được để trống')
        else if (!emailRe.test(email)) errors.push('Email không đúng định dạng')

        if (!password) errors.push('Mật khẩu không được để trống')
        else {
            if (password.length < 8) errors.push('Mật khẩu phải có ít nhất 8 ký tự')
            if (!/[A-Z]/.test(password)) errors.push('Mật khẩu phải chứa ít nhất 1 chữ hoa')
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt')
        }

        if (!roleId && roleId !== 0) errors.push('role_id không được để trống')
        else if (!Number.isInteger(roleId) || roleId < 1 || roleId > 3) errors.push('role_id phải là số từ 1 đến 3')

        if (errors.length) {
            setValidationErrors(errors)
            setSubmitting(false)
            return
        }

        try {
            const payload = { ...form, full_name: name, email: email, role_id: roleId }
            await dispatch(addOneUser(payload)).unwrap()
            setShowForm(false)
            setForm({ full_name: "", email: "", password: "", role_id: 3 })
        }
        catch (err) {
            setServerError(err.error || err.message || "Lỗi khi tạo user")
        }
        finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="bg-white rounded p-3" style={{ gap: '0.5rem' }}>
            <div className="d-flex align-items-center justify-content-around flex-nowrap">
                <form className="d-flex flex-grow-1 me-2" style={{ minWidth: 0 }} onSubmit={(e) => e.preventDefault()}>
                    <div className="input-group" style={{ width: '100%' }}>
                        <input type="text" name="searchInput" id="searchInput" value={searchInput} onChange={handleSearchInput} className="form-control" placeholder="Tìm kiếm theo tên hoặc email" style={{ minWidth: 0 }} />
                        <button type="submit" className="btn input-group-text"><i className="bi bi-search"></i></button>
                    </div>
                </form>
                <select onChange={handleChangeRole} style={{ maxWidth: "160px", minWidth: 0 }} className="form-select me-2" >
                    <option value="all">Tất cả</option>
                    <option value="user">Người dùng</option>
                    <option value="manager">Quản lý</option>
                    <option value="admin">Quản trị viên</option>
                </select>
                {
                    store.getState()?.user.user.role_id == 1 && 
                    (                <button style={{ minWidth: "100px" }} className="btn btn-success" onClick={() => setShowForm((s) => !s)}>Tạo mới <i className="bi bi-plus-lg"></i></button>
)
                }
            </div>

            {showForm && (
                <form className="mt-3 bg-light rounded p-3" onSubmit={handleSubmit}>
                    <div className="row g-2">
                        <div className="col-md-3">
                            <input name="full_name" value={form.full_name} onChange={handleChange} required className="form-control" placeholder="Họ và tên" />
                        </div>
                        <div className="col-md-3">
                            <input name="email" value={form.email} onChange={handleChange} required type="email" className="form-control" placeholder="Email" />
                        </div>
                        <div className="col-md-2">
                            <input name="password" value={form.password} onChange={handleChange} required type="password" className="form-control" placeholder="Mật khẩu" />
                        </div>
                        <div className="col-md-2">
                            <select name="role_id" value={form.role_id} onChange={handleChange} className="form-select">
                                <option value={3}>Người dùng</option>
                                <option value={2}>Quản lý</option>
                                <option value={1}>Quản trị viên</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-flex gap-2">
                            <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Đang...' : 'Tạo'}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={submitting}>Hủy</button>
                        </div>
                    </div>
                    {validationErrors.length > 0 && (
                        <div className="mt-2 text-danger">
                            <ul className="mb-0">
                                {validationErrors.map((m, i) => (<li key={i}>{m}</li>))}
                            </ul>
                        </div>
                    )}
                    {serverError && <div className="mt-2 text-danger">{serverError}</div>}
                </form>
            )}
        </div>
    )
}