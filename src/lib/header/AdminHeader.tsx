import styles from "./adminHeader.module.sass";
import {Link, useLocation} from "react-router-dom";
import {LogoutButton} from "../buttons/LogoutButton.tsx";
import {UserLink} from "./UserLink.tsx";

interface NavPath {
    name: string;
    path: string;
}

const adminPaths: NavPath[] = [
    {name: "Каталог", path: "/admin"},
    {name: "Заказы", path: "/orders"},
    {name: "Заявки", path: "/requests"},
    {name: "Чат", path: "/chat"},
    {name: "Блог", path: "/blog"},
    {name: "Пользователи", path: "/users"},
]

export const AdminHeader = () => {
    const location = useLocation();

    return (
        <aside className={styles.aside}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <UserLink/>
                </div>

                <nav className={styles.nav}>
                    {adminPaths.map(path => (
                        <Link
                            key={path.path}
                            to={path.path}
                            className={`${styles.navLink} ${
                                location.pathname === path.path || location.pathname.startsWith(path.path + "/") ? styles.active : ""
                            }`}
                        >
                            {path.name}
                        </Link>
                    ))}
                </nav>

                <div className={styles.footer}>
                    <LogoutButton/>
                </div>
            </div>
        </aside>
    );
};