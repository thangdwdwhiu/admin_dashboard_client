import { memo, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { revokeOneDevice, revokeOther } from "../../../features/devicesSlice"
import { getDeviceInfo } from "../../../utils/getDeviceInfo"
import { toast } from "react-toastify"
import { formatTimeVN } from "../../../utils/formatTimeVN"

export default memo(function DeviceManager({ devices }) {
    const myDeviceId = getDeviceInfo().device_id
    const deviceList = useSelector((state) => state.devices.devices.list)

    const dispatch = useDispatch()
    const handleRevokeone = useCallback( async (device_id) => {
        try {
            await dispatch(revokeOneDevice(device_id)).unwrap()
            toast.success("đăng xuất thiết bị thành công")
        }
        catch (err) {
            console.log(err);
            toast.error("có lỗi xảy ra")
        }
    }, [dispatch])
    const handleRevokeOther = async () => {

        if (deviceList.length < 2) {
            toast.warning("Không còn thiết bị khác để đăng xuất")
            return
        }
        try {
            await dispatch(revokeOther(myDeviceId)).unwrap()
            toast.success("đã đăng xuất khỏi tất cả các thiết bị")
        }
        catch (err) {
            console.log(err)
            toast.error("Có lỗi xảy ra")

        }

    }
    return (
        <div className="d-flex flex-column gap-3">
            {/* Device */}
            {
                devices.map((i) => (<DeviceItem onRevokeOne={() => handleRevokeone(i.device_id)} key={i.device_id}
                    name={i.device_name}
                    info={i}
                />))
            }



            <button onClick={handleRevokeOther} className="btn btn-danger align-self-start mt-2">
                Đăng xuất khỏi tất cả thiết bị
            </button>
        </div>
    )
})


function DeviceItem({ name, info, onRevokeOne }) {

    const { ip_address, last_used_at, device_id } = info
    const isMyDevice = device_id === getDeviceInfo().device_id
    return (
        <div className="border rounded p-3 d-flex justify-content-between align-items-center">
            <div>
                <strong>{name} {isMyDevice && "(Thiết bị này)"} <i className="bi bi-dot text-success"><small>active</small></i></strong>
                <div className="text-muted small">Địa chỉ ip :{ip_address.includes(":") ? "localhost" : ip_address} ,{formatTimeVN(last_used_at)}</div>
            </div>

            {
                !isMyDevice && (<button className="btn btn-sm btn-outline-danger" onClick={onRevokeOne}>
                    Đăng xuất
                </button>)
            }
        </div>
    )
}
