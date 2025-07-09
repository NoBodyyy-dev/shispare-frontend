import Button from "../../lib/buttons/Button.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {logoutFunc} from "../../store/actions/user.action.ts";

export const Lk = () => {
    const dispatch = useAppDispatch();
    const {curUser, isAuthenticated, isLoadingUser} = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !curUser?._id) navigate("/");
    }, [isAuthenticated]);

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logoutFunc());
        navigate("/");
    }

    return (
        <div className="main__container">
            {isLoadingUser ? <>Загрузка личного кабинета</> :
                <>
                    <p>{curUser?.fullName}</p>
                    <p>{curUser?.legalName}</p>
                    <Button onClick={handleLogout}>Выйти</Button>
                </>
            }
        </div>
    );
};
