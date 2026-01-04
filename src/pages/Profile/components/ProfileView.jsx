import React from 'react'
import styles from '../Profile.module.css'
import avatar from "../../../assets/avatar.jpg"
import { getFullUrl } from '../../../utils/getFullUrl'
const ProfileView = ({profile}) => {
    if (!profile) return null
    console.log(profile);
    
    
    

    return (
        <div className={styles.viewCard}>
            <div className={styles.avatarWrap}>
                <img src={getFullUrl(profile.avatar) || avatar} alt="avatar" className={styles.avatar} />
            </div>
            <div className={styles.info}>
                <h3 className={styles.name}>{profile.full_name || profile.name || '—'}</h3>
                <p className={styles.role}>{profile.role_name || 'User'} : {profile.description}</p>
                <p className={styles.email}>{profile.email}</p>
                
            </div>
        </div>
    )
}

export default ProfileView
