import {Link} from "react-router-dom";
import {memo, useEffect, useState} from "react";
import SearchInput from "../input/SearchInput";
import HeaderCatalog from "./HeaderCatalog.tsx";
import {Button} from "../buttons/Button";
import {useAppSelector} from "../../hooks/state.hook";

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
    const {curUser, isAuthenticated, isLoadingUser} = useAppSelector((state) => state.user);
    const {totalQuantity, totalProductsInCart} = useAppSelector((state) => state.cart)
    const [iconName, setIconName] = useState("");
    const [paths, setPaths] = useState<NavPath[]>([]);

    useEffect(() => {
        const getInitials = (fullName?: string): string => {
            if (!fullName) return "";
            const parts = fullName.trim().split(/\s+/);
            return parts.slice(0, 2).map(part => part[0]?.toUpperCase() ?? '').join('');
        };

        setIconName(getInitials(curUser?.fullName));

        const isAdmin = curUser?.role === "Admin";
        setPaths(isAdmin ? adminPaths : userPaths);
    }, [curUser]);

    return (
        <header className="header">
            <div className="header__container">
                <div className="header__top flex-align-center-sbetw mb-5">
                    <Link to="/" aria-label="На главную">
                        <img src="/logo.png" alt="shispare" className="header-logo"/>
                    </Link>
                    <div className="header__search flex-align-center-sbetw w-100">
                        <HeaderCatalog/>
                        <SearchInput/>
                    </div>
                    <div className="header__buttons flex gap-20">
                        {isLoadingUser ? (
                            <div className="header__buttons-button skeleton-loader"></div>
                        ) : isAuthenticated ? (
                            <Link to={`/lk/${curUser?._id}`} aria-label="Личный кабинет">
                                <div className="header__buttons-button user flex-to-center-col" title={curUser?.fullName}>
                                    {iconName}
                                </div>
                            </Link>
                        ) : (
                            <Link to="/auth">
                                <Button aria-label="Войти в систему">Войти</Button>
                            </Link>
                        )}
                        <Link to="/cart" aria-label="Корзина">
                            <div className="header__buttons-button cart" title="Корзина">
                                {totalProductsInCart > 0 && (
                                    <div className="absolute flex-to-center-col fz-12">{totalProductsInCart}</div>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
                <nav className="">
                    <ul className="flex gap-10"> {/* Добавлен ul для семантики */}
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