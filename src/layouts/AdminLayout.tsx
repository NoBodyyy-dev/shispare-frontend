import {useAuth} from "../context/AuthContext.tsx";
import {useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {useAppSelector} from "../hooks/state.hook.ts";
import {Header} from "../lib/header/Header.tsx";
import {PushMessageList} from "../lib/message/PushMessage.tsx";

export const AdminLayout = () => {
    const {onlineAdmins} = useAppSelector(state => state.socket);
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== "Admin") {
            navigate(-1);
            return;
        };
    }, [user?.role]);

    return (
        <>
            <PushMessageList/>
            <Header/>
            <main className="main">
                <Outlet />
                <div className="main__container">
                    {onlineAdmins.map((p) => {
                        return <p key={p}>{p}</p>
                    })}
                </div>
            </main>
        </>
    );
};