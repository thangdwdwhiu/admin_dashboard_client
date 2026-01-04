import React, { useState, useEffect, useRef } from 'react'
import styles from '../Profile.module.css'
import { toast } from 'react-toastify'

const ProfileEdit = ({ profile, onUpdate }) => {
    const [fullName, setFullName] = useState('')
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const fileRef = useRef(null)

    // Khi profile load xong, sync state
    useEffect(() => {
        if (!profile) return
    }, [profile])

    const handleSubmit = (e) => {
        e.preventDefault()

        // Chặn nếu không thay đổi gì
        if (fullName === profile?.full_name && !avatarFile) {
            toast.warning("Bạn chưa thay đổi thông tin nào")
            return
        }

        const formData = new FormData()
        // luôn append fullName nếu có thay đổi
        if (fullName !== profile?.full_name) {
            formData.append("full_name", fullName)
        }

        if (avatarFile instanceof File) {
            formData.append("avatar", avatarFile)
        }

        if (![...formData.keys()].length) {
            alert("Không có dữ liệu để cập nhật")
            return
        }

        setLoading(true)
        onUpdate(formData).finally(() => setLoading(false))
    }

    const handleSelectImg = () => {
        fileRef.current?.click()
    }

    const handleChangeFile = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    return (
        <form className={styles.editForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label>Full name</label>
                <input
                    value={fullName}
                    placeholder={profile.full_name}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Avatar</label>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    hidden
                    onChange={handleChangeFile}
                />

                {avatarPreview ? (
                    avatarPreview.startsWith('http') || avatarPreview.startsWith('blob:') ? (
                        <img
                            src={avatarPreview}
                            alt="preview"
                            className={styles.avatarPreview}
                            onClick={handleSelectImg}
                        />
                    ) : (
                        <button
                            type="button"
                            className={styles.btnSelectImg}
                            onClick={handleSelectImg}
                        >
                            <i className="bi bi-file-earmark-image"></i>
                            Chọn ảnh
                        </button>
                    )
                ) : (
                    <button
                        type="button"
                        className={styles.btnSelectImg}
                        onClick={handleSelectImg}
                    >
                        <i className="bi bi-file-earmark-image"></i>
                        Chọn ảnh
                    </button>
                )}

            </div>

            <div className={styles.actions}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Update Profile'}
                </button>
            </div>
        </form>
    )
}

export default ProfileEdit
