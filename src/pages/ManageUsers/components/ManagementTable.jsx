import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers, deleteUser, updateUser } from "../../../features/userListSlice"
import Loading from "../../../components/Loading/Loading"
import filterUserlist from "../../../services/filterUserlist"
import { toast } from "react-toastify"

export default function ManagementTable() {
  const { list, loading, filters } = useSelector((state) => state.users)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  if (loading) return <Loading />

  return (
    <div className="table-responsive">
      <table className="table table-hover table-bordered align-middle mb-0">
        <thead className="table-dark text-center">
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {filterUserlist(list, filters).map((user) => (
            <Row key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ================= ROW ================= */

const Row = ({ user }) => {
  const { id, full_name, email, status, role_name } = user

  const isAdmin = useSelector(
    (state) => state.user.user?.role_id === 1
  )
  const roleColor = {
    ADMIN: "bg-danger",
    MANAGER: "bg-warning",
    USER: "bg-primary"
  }
  const statusColor = {
    ACTIVE: "bg-success",
    INACTIVE: "bg-warning",
    BLOCKED: "bg-danger"
  }
  const dispatch = useDispatch()

  const [showFormUpdate, setShowFormUpdate] = useState(false)
  const [formUpdate, setFormUpdate] = useState({})
  const [deleting, setDeleting] = useState(false)
  const [updating, setUpdating] = useState(false)

  /* ===== DELETE ===== */
  const handleDelete = async () => {
    if (!confirm(`Xác nhận xóa người dùng "${full_name}" ?`)) return
    setDeleting(true)
    try {
      const res = await dispatch(deleteUser(id)).unwrap()
      toast.success(res.message || "Xóa thành công ")
    } catch (err) {
      toast.error(err.error || "có lỗi xảy ra khi xóa ")
    } finally {
      setDeleting(false)
    }
  }

  /* ===== FORM CHANGE ===== */
  const handleChangeFormUpdate = (e) => {
    const { name, value } = e.target
    setFormUpdate((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  /* ===== CANCEL ===== */
  const handleCancel = () => {
    setShowFormUpdate(false)
    setFormUpdate({})
  }

  /* ===== UPDATE ===== */
  const handleUpdate = async () => {
    const payload = {}

    if (formUpdate.full_name && formUpdate.full_name !== full_name) {
      payload.full_name = formUpdate.full_name
    }

    if (formUpdate.email && formUpdate.email !== email) {
      payload.email = formUpdate.email
    }

    if (formUpdate.status && formUpdate.status !== status) {
      payload.status = formUpdate.status
    }

    if (formUpdate.role_name && formUpdate.role_name !== role_name) {
      payload.role_name = formUpdate.role_name
    }

    if (Object.keys(payload).length === 0) {
      toast("Không có thay đổi nào được ghi nhận")
      return
    }

    setUpdating(true)
    try {
      const res = await dispatch(updateUser({ id, payload })).unwrap()
      toast.success(res.message || "Cập nhập thành công" )
      setShowFormUpdate(false)
      setFormUpdate({})
    } catch (err) {
      toast.warning(err ?? "Không thể thực hiện thao tác với tài khoản ngang quyền hạn")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <tr>
      <td>{id}</td>

      <td>
        {showFormUpdate ? (
          <input
            name="full_name"
            defaultValue={full_name}
            className="form-control"
            onChange={handleChangeFormUpdate}
          />
        ) : (
          full_name
        )}
      </td>

      <td>
        {showFormUpdate ? (
          <input
            name="email"
            defaultValue={email}
            className="form-control"
            onChange={handleChangeFormUpdate}
          />
        ) : (
          email
        )}
      </td>

      <td>
        {showFormUpdate ? (
          <select
            name="role_name"
            defaultValue={role_name}
            className="form-select"
            onChange={handleChangeFormUpdate}
          >
            <option value="USER">USER</option>
            <option value="MANAGER">MANAGER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        ) : (
          <span className={`badge ${roleColor[role_name]}`}>{role_name}</span>
        )}
      </td>

      <td>
        {showFormUpdate ? (
          <select
            name="status"
            defaultValue={status}
            className="form-select"
            onChange={handleChangeFormUpdate}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="BLOCKED">BLOCKED</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        ) : (
          <span
            className={`badge ${
              statusColor[status]
            }`}
          >
            {status}
          </span>
        )}
      </td>

      <td>
        {isAdmin ? (
          !showFormUpdate ? (
            <>
              <button
                onClick={() => setShowFormUpdate(true)}
                className="btn btn-sm btn-warning me-2"
              >
                Sửa
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn btn-sm btn-danger"
              >
                {deleting ? "Đang..." : "Xóa"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="btn btn-sm btn-secondary me-2"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="btn btn-sm btn-success"
              >
                {updating ? "Đang..." : "Cập nhật"}
              </button>
            </>
          )
        ) : (
          "Không đủ quyền"
        )}
      </td>
    </tr>
  )
}
