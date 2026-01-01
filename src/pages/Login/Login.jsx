import { useState } from "react"
import styles from "./Login.module.css"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../features/authSlice"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
export default function Login() {
    const [showPw, setShowPw] = useState(false)
    const [form, setForm] = useState({email: "", password: ""})
    const handleChangeEye = () =>{
        setShowPw(!showPw)
    }
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    //Lấy input từ form ==============
    const handleChangeInput = (e) => {
        const {name, value} = e.target
        setForm((pre) => ({
            ...pre, [name] : value
        }))
    }
    // Form được submit

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = await dispatch(login(form)).unwrap()
            toast.success(payload.message || "Đăng nhập thành công...")
            if (payload.user.role_id === 3){
                navigate("/profile")
                return
            }
            navigate("/")
        }
        catch (err)
        {
            toast.error(err.error)
            console.log(err.message);     
        }
        

    }
    return (
        <>
            <div className={styles.title}>ADMIN DASHBOARD</div>
            <div className={styles.card}>
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
                        <label htmlFor="email">Email :</label>
                        <input onChange={handleChangeInput} type="text" name="email" id="email" className="form-control" placeholder="your email ..."/>
                        <label htmlFor="password">Password :</label>
                        <div className="input-group">
                            <input onChange={handleChangeInput} type={showPw ? "text" : "password"} name="password" id="password"  className="form-control" placeholder="password ..."/>
                            <span style={{cursor: "pointer"}} onClick={handleChangeEye} className="input-group-text"><i className={`bi bi-eye${showPw ? "-slash" :""}`}></i></span>
                        </div>
                        <Link  to="/forget_password">Quên mật khẩu ?</Link>
                        <button className="btn btn-primary w-25 m-auto">Đăng nhập</button>
                    </form>
            </div>
       
        </>
    )
}