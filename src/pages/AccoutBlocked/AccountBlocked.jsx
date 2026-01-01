import { Link } from "react-router-dom";
import styles from "./AccountBlocked.module.css";

export default function AccountBlocked() {
	return (
		<div className={styles.wrap}>
			<div className={styles.card}>
				<div className={styles.left}>
					<div className={styles.lock} aria-hidden>
						<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
							<rect x="3" y="10" width="18" height="11" rx="2" fill="#021428" opacity="0.06" />
							<path d="M7 10V8a5 5 0 0110 0v2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
							<rect x="6" y="10" width="12" height="8" rx="1.5" fill="#002534" />
							<circle cx="12" cy="14" r="1.8" fill="#9ee7ff" />
						</svg>
					</div>
				</div>

				<div className={styles.content}>
					<h2 className={styles.title}>Tài khoản đã bị khóa</h2>
					<h4 className={styles.subtitle}>Quyền truy cập đã bị tạm dừng</h4>
					<p className={styles.explain}>Tài khoản của bạn hiện đang bị khóa do hoạt động không hợp lệ hoặc do chính sách bảo mật. Vui lòng liên hệ quản trị viên để mở lại quyền truy cập.</p>

					<div className={styles.actions}>
						<Link to="/support" className={styles.btnPrimary}>Liên hệ hỗ trợ</Link>
						<Link to="/login" className={styles.muted}>LOGIN</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
