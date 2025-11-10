import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./error.module.sass";

export const Error500 = () => {
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    window.location.href = "/";
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <div className={`${styles.errorCode} ${styles.code500}`}>500</div>
                <h1 className={styles.errorTitle}>Внутренняя ошибка сервера</h1>
                <p className={styles.errorDescription}>
                    Произошла непредвиденная ошибка. Мы уже работаем над ее устранением.
                    Вы будете автоматически перенаправлены на главную страницу через {countdown} секунд.
                </p>
                <div className={styles.errorActions}>
                    <Link to="/" className={styles.btnPrimary}>
                        На главную сейчас
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className={styles.btnSecondary}
                    >
                        Обновить страницу
                    </button>
                </div>
            </div>
        </div>
    );
};