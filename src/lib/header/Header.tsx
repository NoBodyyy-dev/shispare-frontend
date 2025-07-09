import {Link} from "react-router-dom";
import {memo, useEffect, useState} from "react";
import SearchInput from "../input/SearchInput";
import HeaderCatalog from "./HeaderCatalog.tsx";
import Button from "../buttons/Button";
import {useAppSelector} from "../../hooks/state.hook";

const paths = [
    {name: "О компании", link: "/about"},
    {name: "Блог", link: "/blog"},
    {name: "Оплата и доставка", link: "/delivery-payment"},
    {name: "Решение для дома", link: "/solution"},
    {name: "Контакты", link: "/contacts"},
    {name: "Видео по установке", link: "/videos"},
];

export const Header = memo(() => {
    const {curUser, isAuthenticated, isLoadingUser} = useAppSelector((state) => state.user);
    const {cart} = useAppSelector((state) => state.cart)
    const cartLength = Object.keys(cart).length;
    const [iconName, setIconName] = useState("")

    useEffect(() => {
        const getInitials = (fullName?: string): string => {
            if (!fullName) return ""
            const parts = fullName.trim().split(/\s+/);

            const initials = parts
                .slice(0, 2)
                .map(part => part[0]?.toUpperCase() ?? '');

            return initials.join('');
        };
        setIconName(getInitials(curUser!.fullName!))
        console.log(curUser?.fullName)
        console.log(isAuthenticated)
    }, [curUser?._id, isAuthenticated]);

    return (
        <header className="header">
            <div className="header__container">
                <div className="header__top flex-align-center-sbetw mb-5">
                    <Link to="/">
                        <img src="/logo.png" alt="shispare" className="header-logo"/>
                    </Link>
                    <div className="header__search flex-align-center-sbetw w-100">
                        <HeaderCatalog/>
                        <SearchInput/>
                    </div>
                    <div className="header__buttons flex gap-20">
                        {isLoadingUser
                            ? <div className="header__buttons-button"></div>
                            : (curUser?._id && isAuthenticated) ? (
                                <Link to={`/lk/${curUser._id}`}>
                                    <div className="header__buttons-button user flex-to-center-col">
                                        {iconName}
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/auth">
                                    <Button>Войти</Button>
                                </Link>
                            )}
                        <Link to="/cart">
                            <div className="header__buttons-button cart">
                                {cartLength !== 0 &&
                                    <div className="absolute flex-to-center-col fz-12">{cartLength}</div>}
                            </div>
                        </Link>
                    </div>
                </div>
                <nav className="header__navigation">
                    {paths.map((path) => {
                        return (
                            <li className="header__navigation" key={path.name}>
                                <Link to={path.link}>{path.name}</Link>
                            </li>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
});
