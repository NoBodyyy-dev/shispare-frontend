import React, {useEffect} from 'react';
import Button from "../buttons/Button.tsx";
import {logoutFunc} from "../../store/actions/user.action.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {useNavigate} from "react-router-dom";

export const AdminHeader = () => {
    const paths = [
        {name: "Заказы", link: "/orders"},
        {name: "Чат", link: "/chat"},
        {name: "Товары", link: "/products"},
        {name: "Блог", link: "/blog"},
        {name: "Контакты", link: "/contacts"},
        {name: "Видео по установке", link: "/videos"},
    ];

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logoutFunc());
        navigate("/");
    }

    return (
        <header className="header">
            <div className="header__container">
                <Button onClick={handleLogout}>Выйти</Button>
            </div>
        </header>
    );
};
