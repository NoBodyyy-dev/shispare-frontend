import {Link} from "react-router-dom";
import styles from "./Error.module.sass";
import {Button} from "../../lib/buttons/Button.tsx";

export const Error403 = () => {
    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <div className={styles.errorCode}>403</div>
                <h1 className={styles.errorTitle}>Доступ запрещен</h1>
                <p className={styles.errorDescription}>
                    У вас недостаточно прав для доступа к этой странице.
                    Для получения доступа обратитесь к администратору.
                </p>
                <div className={styles.errorActions}>
                    <Link to="/">
                        <Button>
                            На главную
                        </Button>
                    </Link>
                    <Button
                        onClick={() => window.history.back()}
                    >
                        Назад
                    </Button>
                </div>
            </div>
        </div>
    );
};