import {Link} from "react-router-dom";
import {memo, useEffect, useState} from "react";
import {SearchInput} from "../input/SearchInput";
import {HeaderCatalog} from "./HeaderCatalog.tsx";
import {Button} from "../buttons/Button";
import {useAppSelector} from "../../hooks/state.hook";
import {FaCartShopping} from "react-icons/fa6";
import {useAuth} from "../../context/AuthContext.tsx";

interface NavPath {
    name: string;
    path: string;
}

const userPaths: NavPath[] = [
    {name: "О компании", path: "/about"},
    {name: "Блог", path: "/blog"},
    {name: "Оплата и доставка", path: "/delivery-payment"},
    {name: "Решение для дома", path: "/solution"},
    {name: "Контакты", path: "/contacts"},
    {name: "Видео по установке", path: "/videos"},
];

const adminPaths: NavPath[] = [
    {name: "Заказы", path: "/orders"},
    {name: "Чат", path: "/chat"},
    {name: "Блог", path: "/blog"},
    {name: "Пользователи", path: "/users"},
    {name: "Администраторы", path: "/admins"},
]

export const Header = memo(() => {
    const {user, isAuthenticated, isLoading} = useAuth()
    const {totalProducts} = useAppSelector((state) => state.cart)
    const [iconName, setIconName] = useState("");
    const [paths, setPaths] = useState<NavPath[]>([]);

    useEffect(() => {
        const getInitials = (fullName?: string): string => {
            if (!fullName) return "";
            const parts = fullName.trim().split(/\s+/);
            return parts.slice(0, 2).map(part => part[0]?.toUpperCase() ?? '').join('');
        };

        setIconName(getInitials(user?.fullName));

        const isAdmin = user?.role === "Admin";
        setPaths(isAdmin ? adminPaths : userPaths);
    }, [user]);

    return (
        <header className="header">
            <div className="header__container">
                <div className="header__top flex-align-center-sbetw mb-5">
                    <Link to="/" aria-label="На главную">
                        <img src="/logo.png" alt="shispare" className="header-logo"/>
                    </Link>
                    <div className="header__search flex-to-center gap-10 w-100">
                        <HeaderCatalog/>
                        <SearchInput/>
                    </div>
                    <div className="header__buttons flex gap-20">
                        {isLoading ? (
                            <div className="header__buttons-button skeleton-loader"></div>
                        ) : isAuthenticated ? (
                            <Link to={`/lk/${user?._id}`} aria-label="Личный кабинет">
                                <div className="header__buttons-button user flex-to-center-col" title={user?.fullName}>
                                    {iconName}
                                </div>
                            </Link>
                        ) : (
                            <Link to="/auth">
                                <Button aria-label="Войти в систему">Войти</Button>
                            </Link>
                        )}
                        <Link to="/cart" aria-label="Корзина">
                            <div className="header__buttons-button cart flex-to-center-col" title="Корзина">
                                <FaCartShopping className="fz-18" />
                                {totalProducts > 0 && (
                                    <div className="absolute flex-to-center-col fz-12">{totalProducts}</div>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
                <nav>
                    <ul className="flex gap-10">
                        {paths.map(({name, path}) => (
                            <li key={path} className="">
                                <Link to={path}>{name}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
});