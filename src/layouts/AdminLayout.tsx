import {useAuth} from "../context/AuthContext.tsx";
import {useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {PushMessageList} from "../lib/message/PushMessage.tsx";
import {AdminHeader} from "../lib/header/AdminHeader.tsx";
import styles from "./adminLayout.module.sass";

export const AdminLayout = () => {
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== "Admin") {
            navigate(-1);
            return;
        }
    }, [user?.role]);

    return (
        <div className={styles.adminLayout}>
            <PushMessageList/>
            <AdminHeader/>
            <main className={styles.adminMain}>
                <div className={styles.adminContent}>
                    <Outlet/>
                </div>
            </main>
        </div>
    );
};