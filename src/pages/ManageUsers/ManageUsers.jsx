import store from "../../store/store";
import ManagementTable from "./components/ManagementTable";
import SearchBox from "./components/SearchBox";
import { useNavigate } from 'react-router-dom'

export default function ManageUsers() {
    const roleName = store.getState()?.user.user.role_id == 1 ? "Quản trị viên" : "Quản lý website"
    const navigate = useNavigate()
    
    return (
        <>

            <div className="d-flex flex-column container gap-2">
            <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h2 style={{fontFamily: "serif", marginTop: "10px"}}>Quản lý người dùng</h2>
                        <div>Bạn đang đăng nhập với tư cách: {roleName}</div>
                    </div>
                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-outline-secondary btn-sm mt-3"
                            style={{ borderRadius: 8, padding: '6px 10px' }}
                        >
                            Quay lại Dashboard
                        </button>
                    </div>
            </div>
                <SearchBox />
                <ManagementTable />
            </div>
        </>
    )
}