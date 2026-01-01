import React from 'react'
import styles from './Loading.module.css'

export default function Loading({ text = 'Đang tải...', size = 'normal' }) {
	const cls = size === 'small' ? `${styles.loaderWrap} ${styles.small}` : styles.loaderWrap
	return (
		<div className={cls} role="status" aria-live="polite">
			<div style={{ position: 'relative' }}>
				<div className={styles.orb} />
				<div className={styles.ring} />
			</div>
			<div className={styles.text}>{text}</div>
		</div>
	)
}
