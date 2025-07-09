import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import CodeVerification from "./CodeVerification.tsx";
import {Auth} from "./Auth.tsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {getMeFunc} from "../../store/actions/user.action.ts";

export const AuthPage = () => {
    const {successAuth, isAuthenticated} = useAppSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isAuthenticated) {
            navigate(-1);
            dispatch(getMeFunc());
        }
    }, [isAuthenticated]);

    return (
        <div className="main__container flex-to-center-col">
            {successAuth ? <CodeVerification/> : <Auth/>}
        </div>
    );
};