import { useEffect, useState } from "react"
import styles from "../Profile.module.css"
import { useDispatch, useSelector } from "react-redux"
import { getDevices } from "../../../features/devicesSlice"
import Loading from "../../../components/Loading/Loading"
import DeviceManager from "./DeviceManager"
import ChangePassword from "./ChangePassword"

export default function ProfileDevices() {
  const [show, setShow] = useState(false)
  const [tab, setTab] = useState("password")
  const dispatch = useDispatch()
  const {list: devices, loading}  = useSelector((state) => state.devices.devices)

  const fetchDevices = async () => {
    await dispatch(getDevices()).unwrap()
  }
  useEffect(() => {
    fetchDevices()
  }, [])
  if( loading) 
  return <Loading text="Tải danh sách thiết bị" />
  return (
    <>
      {/* Button mở modal */}
      <button
        className="btn btn-outline-primary d-flex align-items-center gap-2"
        onClick={() => setShow(true)}
      >
        <i className="bi bi-shield-lock-fill"></i>
        Mật khẩu và bảo mật
      </button>

 
      {show && (
        <div className={styles.overlay} onClick={() => setShow(false)}>
          <div
            className={`${styles.modal} card shadow`}
            onClick={(e) => e.stopPropagation()}
          >
  
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Bảo mật & đăng nhập</h5>
              <button className="btn-close" onClick={() => setShow(false)} />
            </div>

            <div className="card-body">
     
              <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === "password" ? "active" : ""}`}
                    onClick={() => setTab("password")}
                  >
                    <i className="bi bi-key text-danger"></i> Đổi mật khẩu
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === "devices" ? "active" : ""}`}
                    onClick={() => setTab("devices")}
                  >
                    <i className="bi bi-pc-display text-primary"></i> Quản lý thiết bị
                  </button>
                </li>
              </ul>

              {/* Content */}
              {tab === "password" && <ChangePassword />}
              {tab === "devices" && <DeviceManager devices={devices} />}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ---------------- SUB COMPONENTS ---------------- */

// function ChangePassword() {
//   return (
//     <form className="d-flex flex-column gap-3">
//       <div>
//         <label className="form-label">Mật khẩu hiện tại</label>
//         <input type="password" className="form-control" />
//       </div>

//       <div>
//         <label className="form-label">Mật khẩu mới</label>
//         <input type="password" className="form-control" />
//       </div>

//       <div>
//         <label className="form-label">Xác nhận mật khẩu mới</label>
//         <input type="password" className="form-control" />
//       </div>

//       <button className="btn btn-primary align-self-start">
//         Cập nhật mật khẩu
//       </button>
//     </form>
//   )
// }

// function DeviceManager({devices}) {
//     const myDeviceId = getDeviceInfo().device_id
//     const deviceList = useSelector((state) => state.devices.devices.list)

//     const dispatch = useDispatch()
//     const handleRevokeone = async (device_id) => {
//         try {
//             await dispatch(revokeOneDevice(device_id)).unwrap()
//             toast.success("đăng xuất thiết bị thành công")
//         }
//         catch (err)
//         {
//             console.log(err);
//             toast.error("có lỗi xảy ra")
//         }
//     }
//     const handleRevokeOther = async () => {
   
//         if (deviceList.length < 2)
//         {
//             toast.warning("Không còn thiết bị khác để đăng xuất")
//             return
//         }
//         try {
//             await dispatch(revokeOther(myDeviceId)).unwrap()
//             toast.success("đã đăng xuất khỏi tất cả các thiết bị")
//         }
//         catch (err) {
//             console.log(err)
//             toast.error("Có lỗi xảy ra")
            
//         }

//     }
//   return (
//     <div className="d-flex flex-column gap-3">
//       {/* Device */}
//         {
//         devices.map((i) => (      <DeviceItem onRevokeOne={()=>handleRevokeone(i.device_id)} key={i.device_id}
//         name={i.device_name}
//         info={i}
//       />))
//         }



//       <button onClick={handleRevokeOther} className="btn btn-danger align-self-start mt-2">
//         Đăng xuất khỏi tất cả thiết bị
//       </button>
//     </div>
//   )
// }

// function DeviceItem({ name, info, onRevokeOne }) {
    
//     const {ip_address, last_used_at, device_id} = info
//     const isMyDevice = device_id === getDeviceInfo().device_id
//   return (
//     <div className="border rounded p-3 d-flex justify-content-between align-items-center">
//       <div>
//         <strong>{name} {isMyDevice && "(Thiết bị này)"} <i className="bi bi-dot text-success"><small>active</small></i></strong>
//         <div className="text-muted small">Địa chỉ ip :{ip_address.includes(":") ? "localhost" : ip_address} ,{formatTimeVN(last_used_at)}</div>
//       </div>

//     {
//         !isMyDevice && (      <button className="btn btn-sm btn-outline-danger" onClick={onRevokeOne}>
//         Đăng xuất
//       </button>)
//     }
//     </div>
//   )
// }
