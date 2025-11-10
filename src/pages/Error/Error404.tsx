import { Link } from "react-router-dom";
import styles from "./error.module.sass";

export const Error404 = () => {
    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <div className={`${styles.errorCode} ${styles.code404}`}>404</div>
                <h1 className={styles.errorTitle}>Страница не найдена</h1>
                <p className={styles.errorDescription}>
                    К сожалению, запрашиваемая страница не существует или была перемещена.
                </p>
                <div className={styles.errorActions}>
                    <Link to="/" className={styles.btnPrimary}>
                        На главную
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className={styles.btnSecondary}
                    >
                        Назад
                    </button>
                </div>
            </div>
        </div>
    );
};