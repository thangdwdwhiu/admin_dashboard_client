import { Link } from "react-router-dom";
import styles from "./PageNotFound.module.css";

export default function PageNotFound() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.scene}>
                <div className={styles.card}>
                    <h1 className={styles.title}>404</h1>
                    <h3 className={styles.subtitle}>Trang không tìm thấy</h3>
                    <p className={styles.desc}>Xin lỗi — trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
                    <Link to="/profile" className={styles.btn}>Về profile</Link>
                </div>

                <div className={styles.visual} aria-hidden>
                    <svg viewBox="0 0 200 200" className={styles.astro} xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="g" x1="0" x2="1">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                                <stop offset="100%" stopColor="#9fd3ff" stopOpacity="0.9" />
                            </linearGradient>
                        </defs>
                        <g transform="translate(100,100)">
                            <circle cx="0" cy="0" r="48" fill="#f7fbff" opacity="0.06" />
                            <circle cx="0" cy="-6" r="34" fill="url(#g)" />
                            <circle cx="-8" cy="-8" r="6" fill="#0b2130" />
                            <rect x="-36" y="24" width="72" height="16" rx="6" fill="#e6f3ff" opacity="0.12" />
                            <path className="tether" d="M-28 34 C-60 10 -90 20 -110 -10" stroke="#cde9ff" fill="none" strokeOpacity="0.12" />
                            <g transform="translate(48,10) rotate(18)">
                                <ellipse cx="0" cy="0" rx="6" ry="10" fill="#dbefff" opacity="0.9" />
                            </g>
                        </g>
                    </svg>

                    <div className={styles.stars}>
                        <span className={styles.star} style={{ top: '8%', left: '12%', animationDelay: '0s' }} />
                        <span className={styles.star} style={{ top: '22%', left: '72%', width: '8px', height: '8px', animationDelay: '0.6s' }} />
                        <span className={styles.star} style={{ top: '62%', left: '48%', animationDelay: '0.2s' }} />
                        <span className={styles.star} style={{ top: '38%', left: '26%', animationDelay: '0.9s' }} />
                        <span className={styles.star} style={{ top: '14%', left: '44%', animationDelay: '0.4s' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}