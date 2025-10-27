import {Link} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";
import {useEffect, useState} from "react";
import {getInitials} from "../../hooks/util.hook.ts";

interface NavPath {
    name: string;
    path: string;
}

const adminPaths: NavPath[] = [
    {name: "Каталог", path: "/admin"},
    {name: "Заказы", path: "/orders"},
    {name: "Чат", path: "/chat"},
    {name: "Блог", path: "/blog"},
    {name: "Пользователи", path: "/users"},
]

export const AdminHeader = () => {
    const {user, isLoading} = useAuth()
    const [iconName, setIconName] = useState("");

    useEffect(() => {
        const initials = getInitials(user?.fullName || "")

        setIconName(getInitials(initials));
    }, [user]);

    return <header className="header">
        <div className="header__container">
            <div className="header__top flex-align-center-sbetw mb-5">
                <Link to="/admin" aria-label="На главную">
                    <img src="/logo.png" alt="shispare" className="header-logo"/>
                </Link>
                <nav>
                    <ul className="flex gap-10">
                        {adminPaths.map(({name, path}) => (
                            <li key={path} className="">
                                <Link to={path}>{name}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="header__buttons flex gap-20">
                    {isLoading ? (
                        <div className="header__buttons-button skeleton-loader"></div>
                    ) : <Link to={`/lk/${user?._id}`} aria-label="Личный кабинет">
                        <div className="header__buttons-button user flex-to-center-col" title={user?.fullName}>
                            {iconName}
                        </div>
                    </Link>
                    }
                </div>
            </div>
        </div>
    </header>
}