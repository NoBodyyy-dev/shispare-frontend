import React, {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {IoIosLogOut} from "react-icons/io";
import {Button} from "./Button.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {logoutFunc} from "../../store/actions/user.action.ts";

export const LogoutButton = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {isLoadingLogout} = useAppSelector(state => state.user);

    const handleLogout = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(logoutFunc());
        navigate("/");
    }, []);

    return <Button
        onClick={handleLogout}
        className="full-width"
        loading={isLoadingLogout}
    >
        <div className="flex-align-center">
            <p className="fz-16 mt-2 mr-5 pl-16"><IoIosLogOut/></p>
            <p>Выйти</p>
        </div>
    </Button>
}