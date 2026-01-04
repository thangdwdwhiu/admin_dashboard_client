import React, { useState, useEffect } from 'react'
import styles from '../Profile.module.css'

const ProfileEdit = ({ profile, onUpdate }) => {
    const [fullName, setFullName] = useState('')
    const [avatar, setAvatar] = useState('')
    const loading = false

    // sync state khi profile load xong
    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name ?? '')
            setAvatar(profile.avatar ?? '')
        }
    }, [profile])

    const handleSubmit = (e) => {
        e.preventDefault()

        const payload = {}

        if (fullName !== profile?.full_name) {
            payload.full_name = fullName
        }

        if (avatar !== profile?.avatar) {
            payload.avatar = avatar
        }

        // không có gì thay đổi → không gọi API
        if (Object.keys(payload).length === 0) {
            return
        }

        onUpdate(payload)
    }

    return (
        <form className={styles.editForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label>Full name</label>
                <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Avatar URL</label>
                <input
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                />
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
