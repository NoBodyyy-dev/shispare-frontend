import Footer from "./lib/footer/Footer.tsx";
import {Header} from "./lib/header/Header.tsx";
import {Outlet, useLocation} from "react-router-dom";
import {PushMessageList} from "./lib/message/PushMessage.tsx";
import {useAuth} from "./context/AuthContext.tsx";
import {useAppSelector} from "./hooks/state.hook.ts";
import {Preloader} from "./lib/Lottie/Preloader.tsx";
import {UserLayout} from "./layouts/UserLayout.tsx";
import {AdminLayout} from "./layouts/AdminLayout.tsx";
import {UserOnlyBodyLayout} from "./layouts/UserOnlyBodyLayout.tsx";
import {useEffect} from "react";

const changeLayoutPaths = ["/notFound", "/auth"];

export const Layout = () => {
    const location = useLocation();
    const {isLoadingUser} = useAppSelector(state => state.user);
    const {user, isAuthenticated} = useAuth();

    useEffect(() => {
        console.log(isLoadingUser);
    }, [isLoadingUser]);

    if (isLoadingUser) return <Preloader/>
    if (changeLayoutPaths.includes(location.pathname)) return <UserOnlyBodyLayout />
    if (user?.role === "Admin") return <AdminLayout/>
    return <UserLayout/>
};
