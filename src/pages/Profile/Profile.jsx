import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading/Loading'
import ProfileView from './components/ProfileView'
import ProfileEdit from './components/ProfileEdit'
import styles from './Profile.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, UpdateProfile } from '../../features/userSlice'
import { Link } from 'react-router-dom'



export default function Profile() {
    const dispatch = useDispatch()
    const { profile, loading } = useSelector((state) => state.user.profile)
    const fetchProfile = async () => {
        try {
            await dispatch(getProfile()).unwrap()
        }
        catch (err) {
            toast.error(err || "Lỗi khi lấy profile")
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleUpdate = async (formData) => {
        try {
            await dispatch(UpdateProfile(formData)).unwrap()
            toast.success("Cập nhật thành công")
        } catch (err) {
            toast.error(err || "Cập nhật thất bại")
        }
    }


    if (loading) return <div className="w-100 h-100 d-flex align-items-center justify-content-center"><Loading text="Đang tải thông tin" /></div>

    return (
        <div style={{ padding: 16 }}>
            <button onClick={() => window.history.back()} className='btn btn-secondary mb-2'>Quay lại</button>
            <h1 style={{ fontSize: 20, marginBottom: 12 }}>Hồ sơ của tôi</h1>

            <div className={styles.container}>
                <div>
                    <ProfileView profile={profile} />
                </div>

                <div>
                    <div className={styles.editForm} style={{ padding: "10px" }}>
                        <h3 style={{ margin: '0 0 12px' }}>Chỉnh sửa thông tin</h3>
                        <p style={{ marginTop: 0, color: '#6b7280', fontSize: 13 }}>Bạn không thể thay đổi email hoặc vai trò từ đây.</p>
                        <ProfileEdit profile={profile} onUpdate={handleUpdate} />
                    </div>
                </div>
            </div>
        </div>
    )
}