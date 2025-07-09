import {AdminHeader} from "../lib/header/AdminHeader.tsx";
import {useAuth} from "../context/AuthContext.tsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useSocket} from "../context/SocketContext.tsx";
import {useAppSelector} from "../hooks/state.hook.ts";

export const AdminLayout = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const {updateOrderStatus, trackOrder, createOrder} = useSocket();
    const {onlineAdmins} = useAppSelector(state => state.socket);

    useEffect(() => {
        if (user?.role !== "Admin") navigate(-1);
    }, [user?.role]);

    return (
        <>
            <AdminHeader/>
            {onlineAdmins.map((p) => {
                return <p>{p}</p>
            })}
        </>
    );
};